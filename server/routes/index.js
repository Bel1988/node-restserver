const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./pedido'));
app.use(require('./imagenes'));
app.use(require('./restaurant'));


module.exports = app;