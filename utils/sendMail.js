const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (to, subject, markup) => {
  const msg = {
    to,
    from: "info@misohe.club",
    subject,
    html: markup,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Mail sent");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = sendMail;
