const PDFDocument = require("pdfkit");
const multer = require("multer");
const aws = require("aws-sdk");
const slugify = require("slugify");
const multerS3 = require("multer-s3");

const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT);
const S3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: process.env.SPACES_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uploadName = `${file.originalname.split(".")[0]}-${Date.now().toString()}.${
        file.originalname.split(".")[1]
      }`;
      const finalName = slugify(uploadName, {
        replacement: "-",
        lower: false,
        trim: true,
      });
      cb(null, finalName);
    },
  }),
});

const createInvoice = function (invoice) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.pipe(fs.createWriteStream(`invoice-${invoice.id}.pdf`));

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();

  var params = {
    key: `invoice-${invoice.id}.pdf`,
    body: doc,
    bucket: process.env.SPACES_BUCKET_NAME,
    contentType: "application/pdf",
  };

  S3.upload(params, function (err, response) {
    if (err) {
      console.log("PDFKIT --->", err);
    }
    console.log("PDFKIT RESPONSE --->", response);
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
  doc
    .fontSize(10)
    .text("Payment is due within 15 days. Thank you for your business.", 50, 780, { align: "center", width: 500 });
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
  return "$" + (cents / 100).toFixed(2);
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
    },
    items: [
      {
        item: data.tour.name,
        description: "Tour",
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
