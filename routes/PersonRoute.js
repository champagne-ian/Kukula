'use strict';

const express = require('express');
const router = express.Router();
const Person = require('../models/PersonModel');
const { json } = require('body-parser');
const e = require('express');
const mailer = require(('../templates/registerTemplate.js'));
const approvedUserBusiness = require(('../templates/approvedUserBusiness.js'));
const deniedUserBusiness = require(('../templates/denieduserBusiness.js'));
const userEnabled = require(('../templates/userEnabled.js'));
const userDisabled = require(('../templates/disabledUser.js'));
const userDeleted = require(('../templates/userDeleted.js'));

//Insert en la DB 
router.post('/RegisterPerson', (req, res) => {
    let body = req.body;
    let newPerson = new Person({
        Name: body.Name,
        FirstlastName: body.FirstlastName,
        SecondlastName: body.SecondlastName,
        Email: body.Email,
        Birth: body.Birth,
        Age: body.Age,
        Identification: body.Identification,
        Address: body.Address,
        Password: body.Password,
        ConfirmPassword: body.ConfirmPassword,
        State: body.State,
        Role: body.Role
    });

    newPerson.save()
        .then((resultDB) => {
            res.json({
                result: true,
                msg: 'Register succesfully',
                resultDB
            });

            let pFullName = resultDB.Name + ' ' + resultDB.FirstlastName + ' ' + resultDB.SecondlastName;
            let pEmail = resultDB.Email;

            mailer.SendEmail(pFullName, pEmail);
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Register failed',
                error
            });
        });
});

//Listar usuarios == READ
router.get('/ListPersons', (req, res) => {
    Person.find()
        .then((listPersonsDB) => {
            res.json({
                result: true,
                msg: 'Data listed correctly',
                listPersonsDB
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed getting users list',
                error
            });
        });
});
router.get('/LookForID', (req, res) => {
    let param = req.query;
    Person.findOne({ _id: param._id })
        .then((PersonDB) => {
            res.json({
                result: true,
                msg: 'Data listed correctly',
                PersonDB
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed getting users list',
                error
            });
        });
});
router.get('/LookForIDDB', (req, res) => {
    let param = req.query;
    Person.findOne({ _id: param._id })
        .then((PersonDB) => {
            res.json({
                result: true,
                msg: 'Data listed correctly',
                PersonDB
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed getting users list',
                error
            });
        });
});
router.get('/AuthenticateUser', (req, res) => {
    let params = req.query;
    Person.findOne({ Email: params.Email, Password: params.Password })
        .then((PersonDB) => {
            if (PersonDB == null) {
                res.json({
                    result: false,
                    msg: 'User or password is incorrect',
                    PersonDB
                });
            } else if (Number(PersonDB.State) == 0) {
                res.json({
                    result: false,
                    msg: 'User is inactive, please reach the admin',
                    PersonDB
                });
            } else {
                res.json({
                    result: true,
                    msg: 'Authentication succeeded! Welcome!',
                    PersonDB
                });
            }
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed user authentication',
                error
            });
        });
});

//UPDATE
router.put('/UpdatePerson', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._id }, {
        $set: body
        // haciendolo asi, limito al cx de cambiar solo lo que declaro en el JSON
        // $set: {
        //     Name: body.Name,
        //     Age: body.Age,
        //     State: body.State
        // }
    })
        .then((info) => {
            res.json({
                result: true,
                msg: 'Data updated correctly',
                info
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed updating user',
                error
            });
        });
});
router.put('/DisableUser', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._id }, {
        $set: {
            State: 0
        }
    })
        .then((info) => {

            let pFullname = body.Name + ' ' + body.FirstlastName + ' ' + body.SecondlastName;
            let pEmail = body.Email;

            res.json({
                result: true,
                msg: 'Data updated correctly',
                info
            });

            userDisabled.SendEmail(pEmail, pFullname);

        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed updating user',
                error
            });
        });
});
router.put('/ActivateUser', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._id }, {
        $set: {
            State: 1
        }
    })
        .then((info) => {

            let pFullname = body.Name + ' ' + body.FirstlastName + ' ' + body.SecondlastName;
            let pEmail = body.Email;

            res.json({
                result: true,
                msg: 'Data updated correctly',
                info
            });

            userEnabled.SendEmail(pEmail, pFullname);
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed updating user',
                error
            });
        });
});

//DELETE
router.delete('/DeletePerson', (req, res) => {
    let body = req.body;
    Person.deleteOne({ _id: body._id })
        .then((info) => {

            let pFullname = body.Name + ' ' + body.FirstlastName + ' ' + body.SecondlastName;
            let pEmail = body.Email;

            userDeleted.SendEmail(pEmail, pFullname);

            res.json({
                result: true,
                msg: 'Data deleted correctly',
                info
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed deleting user',
                error
            });
        });
});

//Subdocuments
//Credit Cards
router.post('/RegisterPaymentMethod', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._id }, {
        $push: {
            PaymentMethods: {
                CardName: body.CardName,
                CardNumber: body.CardNumber,
                ExpireDate: body.ExpireDate,
                CVV: body.CVV
            }
        }
    })
        .then((info) => {
            res.json({
                result: true,
                msg: 'Card registered correctlty!',
                info
            })
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed registering credit card:(',
                info
            });
        });
});
router.delete('/DeletePaymentMethod', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._idPerson }, {
        $pull: {
            PaymentMethods: { _id: body._idCard }
        }
    })
        .then((info) => {
            res.json({
                result: true,
                msg: 'Card deleted correctly',
                info
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed deleting card',
                error
            });
        });
});

//User business
router.post('/RegisterUserBusiness', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._id }, {
        $push: {
            UserBusiness: {
                UserBusinessName: body.UserBusinessName,
                UserBusinessAddress: body.UserBusinessAddress,
                UserBusinessContactNumber: body.UserBusinessContactNumber,
                UserBusinessDescription: body.UserBusinessDescription,
                UserBusinessPrice: body.UserBusinessPrice,
                UserBusinessStatus: 0
                //El 0 significa que estara inactivo hasta que el admin lo active
            }
        }
    })
        .then((info) => {
            res.json({
                result: true,
                msg: 'Business registered correctlty!',
                info
            })
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed registering your business:(',
                info
            });
        });
});
router.delete('/DeleteUserBusiness', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._idPerson }, {
        $pull: {
            UserBusiness: { _id: body._idCard }
        }
    })
        .then((info) => {
            res.json({
                result: true,
                msg: 'Business deleted correctly',
                info
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed deleting card',
                error
            });
        });
});
router.put('/ActivateUserBusiness', (req, res) => {
    let body = req.body;
    Person.findOne({ "_id": body._id, "UserBusiness._id": body.businessId })
        .then((person) => {
            // Realiza la actualización
            return Person.updateOne(
                { "_id": body._id, "UserBusiness._id": body.businessId },
                { $set: { "UserBusiness.$[elem].UserBusinessStatus": 1 } },
                { arrayFilters: [{ "elem._id": body.businessId }] }
            );
        })
        .then((resultDB) => {
            return Person.findOne({ "_id": body._id, "UserBusiness._id": body.businessId });
        })
        .then((updatedPerson) => {
            let pEmail = updatedPerson.Email;
            let ownerBusiness = updatedPerson.Name + ' ' + updatedPerson.FirstlastName;

            let updatedBusinessIndex = updatedPerson.UserBusiness.findIndex(business => business._id == body.businessId);
            let approvedBusiness = updatedPerson.UserBusiness[updatedBusinessIndex].UserBusinessName;

            res.json({
                result: true,
                msg: 'Data updated correctly',
                updatedPerson,
                approvedBusiness
            });

            approvedUserBusiness.SendEmail(pEmail, ownerBusiness, approvedBusiness);
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed updating user',
                error
            });
        });
});
router.put('/DisableUserBusiness', (req, res) => {
    let body = req.body;
    Person.findOne({ "_id": body._id, "UserBusiness._id": body.businessId })
        .then((person) => {
            // Realiza la actualización
            return Person.updateOne(
                { "_id": body._id, "UserBusiness._id": body.businessId },
                { $set: { "UserBusiness.$[elem].UserBusinessStatus": 0 } },
                { arrayFilters: [{ "elem._id": body.businessId }] }
            );
        })
        .then((resultDB) => {
            return Person.findOne({ "_id": body._id, "UserBusiness._id": body.businessId });
        })
        .then((updatedPerson) => {
            let pEmail = updatedPerson.Email;
            let ownerBusiness = updatedPerson.Name + ' ' + updatedPerson.FirstlastName;

            let updatedBusinessIndex = updatedPerson.UserBusiness.findIndex(business => business._id == body.businessId);
            let approvedBusiness = updatedPerson.UserBusiness[updatedBusinessIndex].UserBusinessName;

            res.json({
                result: true,
                msg: 'Data updated correctly',
                updatedPerson,
                approvedBusiness
            });

            deniedUserBusiness.SendEmail(pEmail, ownerBusiness, approvedBusiness);
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed updating user',
                error
            });
        });
});

//User reservations
router.post('/RegisterReserve', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._id }, {
        $push: {
            UserReservations: {
                UserReservationName: body.UserReservationName,
                UserQuantityPeople: body.UserQuantityPeople,
                UserDates: body.UserDates,
                UserBusinessPrice: body.UserBusinessPrice
            }
        }
    })
        .then((info) => {
            res.json({
                result: true,
                msg: 'Bienvenid@ a bordo!!',
                info
            })
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Creo que tenemos un error por aca',
                info
            });
        });
});
router.delete('/DeleteUserReservation', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._idPerson }, {
        $pull: {
            UserReservations: { _id: body._idreservation }
        }
    })
        .then((info) => {
            res.json({
                result: true,
                msg: 'Talvez en otro momento nos veremos aqui! :)',
                info
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Error por aqui',
                error
            });
        });
});

//Limpiar carrito (Pagar)
router.delete('/PayReservations', (req, res) => {
    let body = req.body;
    Person.updateOne({ _id: body._idPerson }, {
        $pull: {
            UserReservations: {} // Eliminar todas las reservaciones
        }
    })
        .then((info) => {
            res.json({
                result: true,
                msg: 'Todas las reservaciones han sido eliminadas exitosamente.',
                info
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Error al eliminar las reservaciones',
                error
            });
        });
});

//Tenemos que hacer a los routes accesibles de la siguiente manera 
module.exports = router;