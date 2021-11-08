const PDFDocument = require("pdfkit");
const aws = require("aws-sdk");
const sendMail = require("./sendMail");
const pdf2Base64 = require("pdf-to-base64");
const Model = require("../model/allModels");

const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT);
const S3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const createInvoice = function (invoice) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);
  doc.end();
  var params = {
    Key: `invoice-${invoice.shipping.invoiceId}.pdf`,
    Body: doc,
    Bucket: process.env.SPACES_BUCKET_NAME,
    ContentType: "application/pdf",
    ACL: "public-read",
  };

  S3.upload(params, async function (err, response) {
    if (err) {
      console.log(err);
    } else {
      const baseFile = await pdf2Base64(response.Location);
      sendMail(invoice.shipping.email, "Your Invoice", "-", baseFile);
    }
  });
};

function generateHeader(doc) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Naturist", 110, 57)
    .fontSize(10)
    .text("Naturist", 200, 50, { align: "right" })
    .text("New Delhi-110093, India", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoice_nr, 150, customerInformationTop)
    .font("Helvetica")
    .text("Invoice Date:", 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(formatCurrency(invoice.subtotal - invoice.paid), 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(invoice.shipping.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.shipping.address, 300, customerInformationTop + 15)
    .text(
      invoice.shipping.city + ", " + invoice.shipping.state + ", " + invoice.shipping.country,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(doc, invoiceTableTop, "Item", "Description", "Unit Cost", "Quantity", "Line Total");
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount / item.quantity),
      item.quantity,
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(doc, subtotalPosition, "", "", "Subtotal", "", formatCurrency(invoice.subtotal));

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(doc, paidToDatePosition, "", "", "Paid To Date", "", formatCurrency(invoice.paid));

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(doc, duePosition, "", "", "Balance Due", "", formatCurrency(invoice.subtotal - invoice.paid));
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc.fontSize(10).text("Leave your worries behind and enjoy you trip", 50, 780, { align: "center", width: 500 });
}

function generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
  return "$" + cents;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

const generateInvoiceData = (data) => {
  const invoice = {
    shipping: {
      name: data.user.name,
      address: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      email: data.user.email,
      invoiceId: data._id,
    },
    items: [
      {
        item: data.tour.name,
        description: "TOUR",
        quantity: 1,
        amount: data.price,
      },
    ],
    subtotal: data.price,
    paid: data.price,
    invoice_nr: data.orderId,
  };
  createInvoice(invoice);
};

module.exports = generateInvoiceData;
