const express = require('express');
const cors = require('cors');
const path = require('path');
const chalk = require('chalk');
const UserRoutes = require('./routes/UserRoutes');
const PetRoutes = require('./routes/PetRoutes');
const PORT = 5000;

const app = express();

const conn = require('./db/conn');

//Configuração de resposta de JSON
app.use(express.json());

//Resolvendo CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

//Definir pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

app.listen(PORT, () => {
    console.log(chalk.bgGreenBright.black(`Servidor rodando => http://localhost:${PORT}`));
});  