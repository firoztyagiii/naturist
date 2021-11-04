const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (to, subject, markup) => {
  const msg = {
    to,
    from: {
      email: "info@misohe.club",
      name: "Naturist",
    },
    subject,
    html: markup,
  };
  sgMail.send(msg).catch((err) => {
    console.log(err);
  });
};

module.exports = sendMail;
