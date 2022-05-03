const chalk = require('chalk');
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://localhost:27017/getapet');
    console.log(chalk.bgGreenBright.black('Conectou ao Mongose!'))
}

main().catch((err) => {
    console.log(chalk.bgRedBright(`Não foi possível conectar ao MongoDB: ${err}`))
});

module.exports = mongoose; 