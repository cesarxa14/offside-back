function connectDB(){
    return new Promise(async (resolve, reject)=>{
        global.pgp = require('pg-promise')({noWarnings: false});
        const params = {
            user: 'postgres',
            pass: 'chelseafc11',
            host: 'localhost',
            port: '5432',
            bd: 'offside'
        };

        const __conexion = `postgres://${params.user}:${params.pass}@${params.host}:${params.port}/${params.bd}`;
        global.dbp = global.pgp(__conexion);
        global.dbp.connect();
        console.log('Conectado a la base de datos');
        return resolve(true)
    })
}

module.exports ={
    connectDB
}