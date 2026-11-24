import dotenv from 'dotenv';
import { sequelize } from './instances/mysql.js';

dotenv.config();

async function main() {
    await sequelize.authenticate()

    await sequelize.sync(); 
    console.log('Tabelas sincronizadas com sucesso!');

    try{
        console.log('Conexão estabelecida')
    }catch(err){
        console.error(err)
    }
};

main();