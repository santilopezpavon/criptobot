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
            host: configuration.email.host,
            port: configuration.email.port,
            secure: configuration.email.secure, // true for 465, false for other ports
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


    sendEmailOperationBuy() {
        if(configuration.email.notification.operations == false) {
            return false;
        }
        this.sendEmail(
            "Operación de compra programada " + configuration.analize.asset.first,
            "Se ha programado una operación de compra " + configuration.analize.asset.first
        );
    }

    sendEmailOperationSell() {
        if(configuration.email.notification.operations == false) {
            return false;
        }
        this.sendEmail(
            "Operación de venta programada " + configuration.analize.asset.first,
            "Se ha programado una operación de venta " + configuration.analize.asset.first
        );
    }

    sendErrorAlert() {
        if(configuration.email.notification.error == false) {
            return false;
        }
        this.sendEmail(
            "Se ha producido un error " + configuration.analize.asset.first,
            "Se ha producido un error por favor revisa los logs " + configuration.analize.asset.first
        );
    }
    
}
module.exports = getComunication;


