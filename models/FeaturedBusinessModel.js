'use strict';
const mongoose = require('mongoose');

const schemaPerson = mongoose.Schema({
    BusinessName: { type: String, required: true, unique: false },
    BusinessDescription: { type: String, required: true, unique: false },
    BusinessPrice: { type: Number, required: true, unique: false },
    BusinessStatus: { type: Number, required: true, unique: false }
    // 0==Inactivo, 1== Activo
});

module.exports = mongoose.model('Business', schemaPerson, 'FeaturedBusiness');
