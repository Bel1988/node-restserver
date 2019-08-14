const express = require('express');
const cors = require('cors');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



//Obtener productos
app.get('/productos', (req, res) => {

    //let desde = req.query.desde || 0;
    //desde = Number(desde);

    Producto.find({})
        //  .skip(desde)
        // .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                productos
            })
        })
});

//Obtener productos por ID
app.get('/productos/:id',(req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe en la base'
                    }
                });
            };

            res.json({
                ok: true,
                producto: productoDB
            })
        })


});




//Buscar productos por nombre
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                productos
            })
        })


})

//Crear un nuevo producto
app.post('/productos',(req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: body.usuId,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });


    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    })
});


//Actualizar estados de productos
app.post('/productos/modificarEstados', (req, res) => {

    let body = JSON.parse(req.body);
    for (var i = 0; i < body.length; i++) {

        Producto.findById(body[i], (productoDB) => {

            if (productoDB.disponible) {
                productoDB.disponible = false;
            }
            else {
                productoDB.disponible = true;
            }
            productoDB.save();
        })
    }
    res.json({
        ok: true
    })
});

//Actualizar un producto
app.put('/productos/:id',(req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del producto no existe'
                }
            });
        };

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    })

});

//Borrar un producto
app.delete('/productos/:id', (req, res) => {

    let id = req.params.id;


    Producto.findById(id, (err, productoDB) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del producto no existe'
                }
            });
        };
        productoDB.remove((err) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            };

            res.json({
                ok: true,
                message: 'Produco Borrado'

            })

        });
    })

});












module.exports = app;