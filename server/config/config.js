//Puerto
process.env.PORT = process.env.PORT || 3000;


//Entorno
process.env.Node_ENV = process.env.Node_ENV || 'dev';

//Base de datos
let urlDB;

if (process.env.Node_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://belphegor:Nemesis@4367@cluster0-h1n1s.mongodb.net/cafe'
};

process.env.URLDB = urlDB;

//mongodb+srv://belphegor:Nemesis@4367@cluster0-h1n1s.mongodb.net/cafe