const express = require('express');
const { create } = require('express-handlebars'); // Usando "create" para configurar o handlebars
const app = express();
const path = require('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const job = require('./models/job');
const Sequelize = require("sequelize");
const Op =  Sequelize.Op;

const PORT = 3000;

// Inicializar servidor
app.listen(PORT, function () {
    console.log(`O express está rodando na porta ${PORT}`);
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração do Handlebars
const hbs = create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// DB Connection
db.authenticate()
    .then(() => {
        console.log("Conectou ao banco com sucesso");
    })
    .catch(err => {
        console.log("Ocorreu um erro ao conectar com o banco:", err);
    });

// Routes
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%';  //ph ->php, word -> wordpress, press -> wordpress

    if(!search){
    job.findAll({order: [
        ['createdAt', 'DESC']
    ]})
    .then(jobs => {

        res.render('index', {
            jobs
        });
    })
    .catch(err => console.log(err))
}else {
    job.findAll({
        where: {title: {[Op.like]: query}},
        order: [
        ['createdAt', 'DESC']
    ]})
    .then(jobs => {

        res.render('index', {
            jobs, search
        });
    })
    
    .catch(err => console.log(err));
}

});

// Jobs Routes
app.use('/jobs', require('./routes/jobs'));