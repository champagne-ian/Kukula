'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config();

this.SendEmail = (pEmail, ownerBusiness, approvedBusiness) => {
    //crear un transporter, el que encarga de llevar la info a gmail
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: pEmail,
        subject: '¡Te tenemos buenas noticias!',
        html: `
        <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
            <tr height="200px">
                <td>
                    <h1 style="color:#fff; text-align:center">
                        Estimado, ${ownerBusiness}
                    </h1>
                    <p style="color:#fff; text-align:center">
                        Nos complace informarte que exitosamente tu negocio 
                        <span style:"color:#e84343">
                            "${approvedBusiness}"
                        </span>
                        ha sido aprobado para estar en Kukula!
                    </p>
                </td>
            </tr>
            <tr bgcolor="#fff">
                <td style="text-align:center;">
                    <p style="color: #000;">Listo para generar dinero con Kukula?</p>
                </td>
            </tr>
        </table>
        `
    }

    //enviar el correo 
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email send!! :)' + info.response);
        }
    });
};
module.exports = this;