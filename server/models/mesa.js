var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var mesaSchema = new Schema({
    numero: { type: Number, required: [true, 'El numero de mesa es necesario'] },
    disponible: { type: Boolean, required: true, default: true },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
});


module.exports = mongoose.model('Mesa', mesaSchema);