const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (to, subject, markup, pdf) => {
  const msg = {
    to,
    from: {
      email: "info@misohe.club",
      name: "Naturist",
    },
    subject,
    html: markup,
  };
  if (pdf) {
    msg.attachments = [{ filename: "invoice.pdf", content: pdf, type: "application/pdf", disposition: "attachment" }];
  }
  console.log("MAIL DATA ===>", msg);
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

module.exports = sendMail;
