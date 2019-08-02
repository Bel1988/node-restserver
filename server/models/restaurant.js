var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var restaurantSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    direccion: { type: String, required: [true, 'La dirección es necesararia'] },
    descripcion: { type: String, required: false },
    disponible: { type: Boolean, required: true, default: true },
    owner: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


module.exports = mongoose.model('Restaurant', restaurantSchema);