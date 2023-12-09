'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config();

this.SendEmail = (pFullName, pEmail) => {
    //crear un transporter, el que encarga de llevar la info a gmail
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    //crear el cuerpo del correo y la etsructura
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: pEmail,
        subject: '¡Ahora eres un Kukula más!',
        html: `
        <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
            <tr height="200px">
                <td>
                    <h1 style="color:#fff; text-align:center">
                        ¡Bienvenido,
                    </h1>
                    <p style="color:#fff; text-align:center">
                        <span style:"color:#e84343">
                            ${pFullName}
                        </span>
                        , al mundo de Kukula!
                    </p>
                </td>
            </tr>
            <tr bgcolor="#fff">
                <td style="text-align:center;">
                    <p style="color: #000;">Listo para visitar Costa Rica?</p>
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