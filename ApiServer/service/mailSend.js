const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "lakshmisaha230213@gmail.com",
    pass: "lmurbeuwqhgobnkw",
  },
});
const sent = (to, subject, isBodyInHtml, body) => {
  let mailOption = {
    from: "lakshmisaha230213@gmail.com",
    to: to,
    subject: subject,
  };
  if (isBodyInHtml === false) {
    mailOption.text = body;
  } else {
    mailOption.html = body;
  }
  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};
module.exports = {
  sent,
};
