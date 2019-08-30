var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var pedidoSchema = new Schema({
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
    aclaracion: { type: String, required: false },
    status: { type: String, default: "Pendiente" },
    mesa: { type: Number, required: true },
    fecha: { type: String, default: Date.now }
});


module.exports = mongoose.model('Pedido', pedidoSchema);