const express = require('express');
const { create } = require('express-handlebars'); // Usando "create" para configurar o handlebars
const app = express();
const path = require('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');

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
    res.render('index');
});

// Jobs Routes
app.use('/jobs', require('./routes/jobs'));