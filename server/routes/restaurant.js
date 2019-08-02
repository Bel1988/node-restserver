const express = require('express');
const cors = require('cors');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Restaurant = require('../models/restaurant');
app.use(cors());



//Obtener restaurants
app.get('/restaurant', verificaToken, (req, res) => {

    //let desde = req.query.desde || 0;
    //desde = Number(desde);

    Restaurant.find({ disponible: true })
        //  .skip(desde)
        // .limit(5)
        .populate('owner', 'nombre email')
        .exec((err, restaurantes) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                restaurantes
            })
        })
});

//Obtener restaurant por ID
app.get('/restaurant/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Restaurant.findById(id, )
        .populate('owner', 'nombre email')
        .exec((err, restaurantDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!restaurantDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe en la base'
                    }
                });
            };

            res.json({
                ok: true,
                restaurant: restaurantDB
            })
        })


});





//Crear un nuevo restaurant
app.post('/restaurant', verificaToken, (req, res) => {

    let body = req.body;

    let restaurant = new Restaurant({
        owner: body.owner,
        nombre: body.nombre,
        direccion: body.direccion,
        descripcion: body.descripcion,
        disponible: body.disponible,

    });


    restaurant.save((err, restaurantDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!restaurantDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.status(201).json({
            ok: true,
            restaurant: restaurantDB
        });

    })
});

//Actualizar un restaurant
app.put('/restaurant/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Restaurant.findById(id, (err, restourantDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!restaurantDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del restaurant no existe'
                }
            });
        };

        restaurantDB.owner = body.owner,
            restaurantDB.nombre = body.nombre,
            restaurantDB.direccion = body.direccion,
            restaurantDB.descripcion = body.descripcion,
            restaurantDB.disponible = body.disponible,

            restaurantDB.save((err, restaurantGuardado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });

                }
                res.json({
                    ok: true,
                    restaurant: restaurantGuardado
                })
            })
    })

});

//Borrar un restaurant

app.delete('/restaurant/:id', verificaToken, (req, res) => {

    let id = req.params.id;


    Restaurant.findById(id, (err, restaurantDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!restaurantDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del restaurant no existe'
                }
            });
        };

        restaurantDB.disponible = false;

        restaurantDB.save((err, restaurantBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                restaurant: restaurantBorrado,
                message: 'Restaurant Borrado'

            })

        });
    })

});












module.exports = app;