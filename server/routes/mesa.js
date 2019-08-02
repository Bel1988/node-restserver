const express = require('express');
const cors = require('cors');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Mesa = require('../models/mesa');
app.use(cors());



//Obtener mesas
app.get('/mesa', verificaToken, (req, res) => {

    Mesa.find({ disponible: true })
        .exec((err, mesas) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                mesas
            })
        })
});

//Obtener producto por ID
app.get('/mesa/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Mesa.findById(id, )
        .exec((err, mesaDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!mesaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe en la base'
                    }
                });
            };

            res.json({
                ok: true,
                mmesa: mesaDB
            })
        })


});





//Crear un nueva mesa
app.post('/mesa', verificaToken, (req, res) => {

    let body = req.body;

    let mesa = new Mesa({
        numero: body.numero,
        disponible: body.disponible,
        restaurant: body.restaurant

    });


    mesa.save((err, mesaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!mesaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.status(201).json({
            ok: true,
            mesa: mesaDB
        });

    })
});

//Actualizar una mesa
app.put('/mesa/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Mesa.findById(id, (err, mesaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!mesaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de la mesa no existe'
                }
            });
        };

        mesaDB.numero = body.numero;
        mesaDB.disponible = body.disponible;
        mesaDB.restaurant = body.restaurant;

        mesaDB.save((err, mesaGuardada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            res.json({
                ok: true,
                mesa: mesaGuardada
            })
        })
    })

});

//Borrar una mesa
app.delete('/mesa/:id', verificaToken, (req, res) => {

    let id = req.params.id;


    Producto.findById(id, (err, mesaDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!mesaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de la mesa no existe'
                }
            });
        };

        mesaDB.disponible = false;

        mesaDB.save((err, mesaBorrada) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                mesa: mesaBorrada,
                message: 'Mesa Borrada'

            })

        });
    })

});



module.exports = app;