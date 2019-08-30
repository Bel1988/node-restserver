const express = require('express');
const dateFormat = require('dateformat');
const moment = require('moment');
const cors = require('cors');
const { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Pedido = require('../models/pedido');
app.use(cors());
//prueba
app.post('/pedido',(req, res) => {

    let body = req.body;


    let dt = body.fecha;
    let fechaN = dateFormat(dt, 'd/m/yyyy HH:MM:ss');

    let pedido = new Pedido({
        usuario: req.usuario._id,
        producto: body.producto,
        aclaracion: body.aclaracion,
        fecha: fechaN,
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
// top 5 Productos mas pedidos
app.get('/pedido/masPedidos', (req, res) => {

    Pedido.aggregate([
            //agrupa por id y cuenta
            { $group: { _id: "$producto", count: { $sum: 1 } } },

            //  { $lookup: { from: 'productos', localField: 'producto', foreignField: '_id', as: 'producto' } },

            //ordena por la cantidad de forma descendente
            { $sort: { count: -1 } },
            //limita los resultados a 5
            { $limit: 5 }
        ])
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
//top 5 productos mas pedidos entre 2 fecha
app.get('/pedido/masPedidosEntreFechas', (req, res) => {
    let fechaInicio = req.query.desde;
    let fechaFin = req.query.hasta;

    Pedido
    //.find({ fecha: { $gte: "10/8/2019", $lte: "15/8/2019" } })
        .aggregate([

            //agrupa por id y cuenta las repeticiones
            { $group: { _id: "$producto", count: { $sum: 1 } } },

            //  { $lookup: { from: 'productos', localField: 'producto', foreignField: '_id', as: 'producto' } },
            //Filtra por fecha
            { $match: { fecha: { $gte: '10/8/2019', $lte: '15/8/2019' } } },

            //ordena por la cantidad de forma descendente
            { $sort: { count: -1 } },
            //limita los resultados a 5
            { $limit: 5 }
        ])
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