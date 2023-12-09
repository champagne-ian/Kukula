'use strict';

//Como voy a usar MongoDB debo traerme la dependencia a este file
const mongoose = require('mongoose');

//Aca creamos el schema (tabla) de MongoDB 
const schemaPerson = mongoose.Schema({
    Name: { type: String, required: true, unique: false },
    FirstlastName: { type: String, required: true, unique: false },
    SecondlastName: { type: String, required: false, unique: false },
    Email: { type: String, required: true, unique: true },
    Birth: { type: String, required: true, unique: false },
    Age: { type: Number, required: true, unique: false },
    Identification: { type: String, required: true, unique: true },
    Address: { type: String, required: true, unique: false },
    Password: { type: String, required: true, unique: false },
    ConfirmPassword: { type: String, required: true, unique: false },
    State: { type: Number, required: false, unique: false },
    //El estado en el persona route va a ser 0, ya que tiene que ser aprobado por el admin para usar la app
    Role: { type: Number, required: false, unique: false },
    //Rol por defecto en el PersonRoute va a ser 0, lo que significa cliente/dueno de negocio
    PaymentMethods: [
        {
            CardName: { type: String, required: true, unique: false },
            CardNumber: { type: Number, required: true, unique: false },
            ExpireDate: { type: String, required: true, unique: false },
            CVV: { type: Number, required: true, unique: false }
        }
    ],
    UserBusiness: [
        {
            UserBusinessName: { type: String, required: true, unique: false },
            UserBusinessAddress: { type: String, required: true, unique: false },
            UserBusinessContactNumber: { type: Number, required: true, unique: false },
            UserBusinessDescription: { type: String, required: true, unique: false },
            UserBusinessPrice: { type: Number, required: true, unique: false },
            UserBusinessStatus: { type: Number, required: true, unique: false }
        }
    ],
    UserReservations: [
        {
            UserReservationName: { type: String, required: true, unique: false },
            UserQuantityPeople: { type: Number, required: true, unique: false },
            UserDates: { type: String, required: true, unique: false },
            UserBusinessPrice: { type: Number, required: true, unique: false }
        }
    ]
});

//Con esta linea hacemos publico el schema y cualquier metodo pueda interactuar con este
module.exports = mongoose.model('Person', schemaPerson, 'Users');