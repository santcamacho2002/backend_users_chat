const mongoose = require('mongoose');

const dbConnection = async() => {

    try{

       await mongoose.connect(process.env.DB_CNN)

       console.log('Base de datos en linea');

       mongoose.connection.on('disconnected', () => {
        console.log('Base de datos desconectada. Intentando reconectar...');
        reconnect();
    });

    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de inicializar la base de datos');
    }

}

const reconnect = () => {
    setTimeout(async () => {
        try {
            await mongoose.connect(process.env.DB_CNN, {
                useNewUrlParser: true
            });
            console.log('Reconnected to the database');
        } catch (error) {
            console.log('Reconnection failed. Retrying...');
            reconnect();
        }
    }, 5000); // Retry after 5 seconds
};


module.exports = {
    dbConnection
}