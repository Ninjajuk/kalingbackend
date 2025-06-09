require('dotenv').config();
const nodemailer = require('nodemailer');
exports.contactForm = async (req, res) => {
    // Define mapping of websites to recipient emails
    const emailMap = {
        "https://ayahoftruth.site/": "biosamsuddin@gmail.com",
        "http://localhost:8080/contact-us": "biosamsuddin@gmail.com",
        "website3.com": "support@website3.com"
    };

    const { name, email, message, website } = req.body;
    const recipient = emailMap[website];
    if (!recipient) {
        return res.status(400).json({ error: "Unknown website." });
    }

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSKEY_EMAIL,
        },
    });
    module.exports = transporter;
    const mailOptions = {
        from: email,
        to: recipient,
        subject: `New message from ${name} via ${website}`,
        text: message,
    };
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).json({ error: "Failed to send email", detail: err.message });
    }
};