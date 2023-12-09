'use strict';

const express = require('express');
const router = express.Router();
const Business = require('../models/FeaturedBusinessModel');
const { json } = require('body-parser');
const e = require('express');

router.post('/CreateFeaturedBusiness', (req, res) => {
    let body = req.body;
    let newBusiness = new Business({
        BusinessName: body.BusinessName,
        BusinessDescription: body.BusinessDescription,
        BusinessPrice: body.BusinessPrice,
        BusinessStatus: body.BusinessStatus
    });

    newBusiness.save()
        .then((resultDB) => {
            res.json({
                result: true,
                msg: 'Register succesfully',
                resultDB
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Register failed',
                error
            });
        });
});

router.get('/ShowBusiness', (req, res) => {
    Business.find()
        .then((listBusinessDB) => {
            res.json({
                result: true,
                msg: 'Data listed correctly',
                listBusinessDB
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed getting business list',
                error
            });
        });
});
router.get('/LookForID', (req, res) => {
    let param = req.query;
    Business.findOne({ _id: param._id })
        .then((BusinessDB) => {
            res.json({
                result: true,
                msg: 'Data listed correctly',
                BusinessDB
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed getting business list',
                error
            });
        });
});
router.get('/LookForIDDBFBusiness', (req, res) => {
    let param = req.query;
    Business.findOne({ _id: param._id })
        .then((BusinessDB) => {
            res.json({
                result: true,
                msg: 'Data listed correctly',
                BusinessDB
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed getting business list',
                error
            });
        });
});

router.put('/DisableFBusiness', (req, res) => {
    let body = req.body;
    Business.updateOne({ _id: body._id }, {
        $set: {
            BusinessStatus: 0
        }
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
router.put('/ActivateBusiness', (req, res) => {
    let body = req.body;
    Business.updateOne({ _id: body._id }, {
        $set: {
            BusinessStatus: 1
        }
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
                msg: 'Failed updating Fbusiness',
                error
            });
        });
});

router.delete('/DeleteFBusiness', (req, res) => {
    let body = req.body;
    Business.deleteOne({ _id: body._id })
        .then((info) => {
            res.json({
                result: true,
                msg: 'Data deleted correctly',
                info
            });
        })
        .catch((error) => {
            res.json({
                result: false,
                msg: 'Failed deleting Fbusiness',
                error
            });
        });
});

module.exports = router;