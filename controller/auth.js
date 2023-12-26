require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter=nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL,
      pass: passKEY_EMAIL,
    },
  });


  const mailOptions = {
    from: 'codewizardsam@gmail.com',
    to: 'biosamsuddin@gmail.com',
    subject: 'Order details',
    text: 'Hi Samsu .Please find the order details below-'
  };

  exports.sendMail = async function ({to, subject, text, html}){
    let info = await transporter.sendMail({
        from: '"E-commerce" <codewizardsam@gmail.com>', // sender address
        to,
        subject,
        text,
        html
      });
    return info;  
}

