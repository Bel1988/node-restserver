const express = require('express');
const datetime = require('node-datetime');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Pedido = require('../models/pedido');


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
app.get('/pedido', verificaToken, (req, res) => {

    //let desde = req.query.desde || 0;
    //desde = Number(desde);

    Pedido.find({ status: "Pendiente" })
        //  .skip(desde)
        // .limit(5)
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

module.exports = app;