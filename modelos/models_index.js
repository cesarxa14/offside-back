const { rejects } = require("assert");
const pgPromise = require("pg-promise");
const { debugPort } = require("process");

function getAllNoticias(){
    return new Promise(async (resolve, reject)=>{
        let sql = 'SELECT * FROM noticias';
        sql = await global.pgp.as.format(sql);
        console.log('sql->>>', sql);
        global.dbp.any(sql).then(res=>{
            return resolve(res);
        }).catch(err =>{
            return reject(err);
        });
    })

}

module.exports = {
    getAllNoticias
}