const nodemailer = require("nodemailer");
const constants = require(__dirname + "/../../.env")

exports.createTransporter = async (email) => {

};
exports.sendMessage = (from, to, subject, text, html) => {
    return new Promise((resolve, reject) => {
        const random = Math.ceil(Math.random() * 999999);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: constants.EMAIL_USERNAME,
                pass: constants.EMAIL_PASS,
            },
        });
        if (!transporter) {
            reject(null);
        }
        transporter.sendMail({
            from,
            to,
            subject,
            text: `Your verification is ${random}`,
            html
        }).then(() => {
            resolve(random);
        }).catch((e) => {
            reject(e);
        });
    });
}