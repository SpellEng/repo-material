const nodemailer = require('nodemailer');
const config = require('./config/keys');

let transporter = nodemailer.createTransport({
    host: "smtp.zeptomail.in",
    port: 587,
    auth: {
        user: config.EMAIL,
        pass: config.PASSWORD
    }
});

const sendEmail = (email, subject, html) => {
    try {
        var mailOptions = {
            from: '"SpellEng Team" <team@spelleng.com>',
            to: email,
            subject,
            html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Successfully sent');
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = sendEmail;