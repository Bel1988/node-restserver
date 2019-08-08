const express = require('express');
const datetime = require('node-datetime');
const cors = require('cors');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Pedido = require('../models/pedido');
app.use(cors());
//prueba
app.post('/pedido', verificaToken, (req, res) => {

    let body = req.body;


    let dt = new datetime.create();
    let formattedDate = dt.format('d/m/y H:M:S');

    let pedido = new Pedido({
        usuario: req.usuario._id,
        producto: body.producto,
        aclaracion: body.aclaracion,
        status: body.status,
        // fecha: dt,
        mesa: body.mesa

    });

    pedido.save((err, pedidoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!pedidoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.status(201).json({
            ok: true,
            pedido: pedidoDB
        });

    })
});

//Obtener pedidos pendientes
app.get('/pedido', (req, res) => {


    Pedido.find({})
        .populate('usuario', 'nombre email')
        .populate('producto', 'nombre precioUni categoria')
        .exec((err, pedidos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                pedidos
            })
        })
});

// Obtener pedidos aceptados
app.get('/pedido/po', verificaToken, (req, res) => {


    Pedido.find({ status: "Aceptado" })
        .populate('usuario', 'nombre email')
        .populate('producto', 'nombre precioUni')
        .exec((err, pedidos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                pedidos
            })
        })
});

//Obtener Productos Rechazados
app.get('/pedido/o', verificaToken, (req, res) => {


    Pedido.find({ status: "Rechazado" })
        .populate('usuario', 'nombre email')
        .populate('producto', 'nombre precioUni')
        .exec((err, pedidos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                pedidos
            })
        })
});


app.put('/pedido', (req, res) => {

    let body = req.body;

    Pedido.findById(body.id, (err, pedidoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!pedidoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del pedido no existe'
                }
            });
        };

        if (body.status === 'Pendiente') {
            pedidoDB.status = 'Aceptado';
        } else if (body.status === 'Aceptado') {
            pedidoDB.status = 'Terminado';
        }



        pedidoDB.save((err, pedidoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            res.json({
                ok: true,
                pedido: pedidoGuardado
            })
        })
    })

});


module.exports = app;