'use strict';

//aca vamos a ir llamando los diferentes routes a utilizar
const PersonRoute = require("./PersonRoute");
const FeaturedBusiness = require("./FeaturedBusinessRoute");

module.exports = (kukula_app) => {
    kukula_app.use("/API", PersonRoute);
    kukula_app.use("/API", FeaturedBusiness);

    //Manejar rutas no encontradas devolviendo 404
    kukula_app.use((req, res) => {
        res.status(404);
        res.send({
            error: {
                status: 404,
                message: 'Route not found:('
            }
        });
    });

    //Manejar errores
    kukula_app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.send({
            error: {
                status: err.status || 500,
                message: err.message
            }
        });
    });
}