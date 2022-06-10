const nodemailer = require("nodemailer");
const configuration = require("../../config.json");

function getComunication() {
    return Comunication.getInstance();
}

class Comunication {

    static #instance;

    static getInstance() {
        if (!Comunication.#instance) {
            Comunication.#instance = new Comunication()
        }
        return Comunication.#instance
    }

    sendEmail(subject, mensaje) {
        if(configuration.email.active == false) {
            return false;
        }
        let transporter = nodemailer.createTransport({
            host: "in-v3.mailjet.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: configuration.email.user, // generated ethereal user
              pass: configuration.email.pass, // generated ethereal password
            },
        });
        
        
        transporter.sendMail({
            from: configuration.email.from, 
            to: configuration.email.to, 
            subject: subject,
            text: mensaje, 
        });
    }
}
module.exports = getComunication;


