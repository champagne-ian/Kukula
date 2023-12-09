'use strict';

//Aca estamos llamando a las dependencias y alamcenandolas en una variable para usarlas en el proyecto
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const initiateRoutes = require("./routes");

//Aca creamos la app de Kukula, la cual va a usar todas las funciones de las siguientes dependencias
const kukula_app = express();
kukula_app.use(cors());
kukula_app.use(bodyParser.json());
kukula_app.use(bodyParser.urlencoded({ extended: false }));
kukula_app.use(express.static(__dirname + '/Public'));

//Con esto me pego a la base de datos
mongoose.connect(process.env.MONGO_URI, {
    //Si no les corre el nodemon, descomenten la linea 20 y 21
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('DataBase connection was successfull!');

    const server = kukula_app.listen(process.env.PORT || 8000, () => {
        let port = server.address().port;
        console.log('Kukula App is running on Port: ', port)

        //Aca se incializan las rutas del api
        initiateRoutes(kukula_app);
    });
})
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });