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



// Vencimiento del Token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 2 * 30;





// SEED de autenticacion

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



//Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '563849544430-lehhiono02coikrudi17raqg56kogcg7.apps.googleusercontent.com';