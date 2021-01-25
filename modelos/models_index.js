const { rejects } = require("assert");
const pgPromise = require("pg-promise");
const { debugPort } = require("process");

function getUsuario(id_persona){
    return new Promise(async (resolve, reject)=>{
        let sql = 'SELECT * FROM persona WHERE id_persona = $1';
        sql = await global.pgp.as.format(sql, [id_persona]);
        console.log('GET USUARIO sql->>>', sql);
        global.dbp.one(sql).then(res=>{
            return resolve(res);
        }).catch(err =>{
            return reject(err);
        });
    })

}

function getNoticia(id_noticia){
    return new Promise(async (resolve, reject)=>{
        let sql = 'SELECT * FROM noticias WHERE id_noticia = $1';
        sql = await global.pgp.as.format(sql, [id_noticia]);
        console.log('GET USUARIO sql->>>', sql);
        global.dbp.one(sql).then(res=>{
            return resolve(res);
        }).catch(err =>{
            return reject(err);
        });
    })

}

function getAllNoticias(id_persona){
    return new Promise(async (resolve, reject)=>{
        let sql = `SELECT   n.id_noticia, 
                            n.titulo, 
                            n.subtitulo, 
                            n.cuerpo_noticia, 
                            n.fecha_publicacion, 
                            n.cantidad_likes, 
                            n.foto_noticia, 
                            t.id_tag, 
                            t.desc_tag, 
                            COALESCE(pxn.likes, FALSE) AS like,
                            COALESCE(pxn.favoritos, FALSE) AS favorito
                    FROM  tag t, noticias n LEFT JOIN persona_x_noticia pxn ON n.id_noticia = pxn._id_noticia and $1 = pxn._id_persona
                    WHERE n._id_tag = t.id_tag
                    ORDER BY id_noticia DESC`;
        sql = await global.pgp.as.format(sql, [id_persona]);
        console.log('sql->>>', sql);
        global.dbp.any(sql).then(res=>{
            return resolve(res);
        }).catch(err =>{
            return reject(err);
        });
    })

}

function getTags(){
    return new Promise(async (resolve, reject)=>{
        let sql = 'SELECT * FROM tag';
        sql = await global.pgp.as.format(sql);
        console.log('GET TAGS sql->>>', sql);
        global.dbp.any(sql).then(res=>{
            return resolve(res);
        }).catch(err =>{
            return reject(err);
        });
    })

}

function crearNoticia(){
    return new Promise(async (resolve, reject)=>{
        let sql = '';//crear funcion de crear noticia en pgadmin
        sql = await global.pgp.as.format(sql);
        console.log('sql->>>', sql);
        global.dbp.any(sql).then(res=>{
            return resolve(res);
        }).catch(err =>{
            return reject(err);
        });
    })
}

function login(usuario, contraseña){
    return new Promise(async (resolve, reject)=>{
        let sql = 'SELECT public.__offside_1_login($1,$2) res'; //crear funcion de crear noticia en pgadmin
        sql = await global.pgp.as.format(sql,[usuario, contraseña]);
        console.log('sql->>>', sql);
        global.dbp.any(sql).then(res=>{
            return resolve(res[0].res);
        }).catch(err =>{
            return reject(err);
        });
    })

}

function crearNoticia(id_persona, titulo, subtitulo, cuerpo, id_tag, foto){
    return new Promise(async (resolve, reject)=>{
        let sql = 'SELECT __offside_2_crear_noticia($1, $2, $3, $4, $5, $6) res'; //crear funcion de crear noticia en pgadmin
        sql = await global.pgp.as.format(sql,[id_persona, titulo, subtitulo, cuerpo, id_tag, foto]);
        console.log('CREAR NOTICIA sql->>>', sql);
        global.dbp.one(sql).then(data=>{
            return resolve(data.res);
        }).catch(err =>{
            return reject(err);
        });
    })

}

function editarNoticia(id_noticia, id_persona, titulo, subtitulo, cuerpo, id_tag){
    return new Promise(async (resolve, reject)=>{
        let sql = 'SELECT __offside_5_editar_noticia($1, $2, $3, $4, $5, $6) res';
        sql = await global.pgp.as.format(sql,[id_noticia, id_persona, titulo, subtitulo, cuerpo, id_tag]);
        console.log('EDITAR NOTICIA sql->>>', sql);
        global.dbp.one(sql).then(data=>{
            return resolve(data.res);
        }).catch(err =>{
            return reject(err);
        });
    })
}
function borrarNoticia(id_noticia){
    return new Promise(async (resolve, reject)=>{
        let sql = 'DELETE FROM noticias WHERE id_noticia = $1';
        sql = await global.pgp.as.format(sql,[id_noticia]);
        console.log('BORRAR NOTICIA sql->>>', sql);
        global.dbp.any(sql).then(data=>{
            console.log(data)
            return resolve(data);
        }).catch(err =>{
            return reject(err);
        });
    })

}


function likeNoticia(id_noticia, id_persona, likeado){
    return new Promise(async (resolve, reject)=>{
        let sql = 'SELECT __offside_3_like_noticia($1, $2, $3)'; 
        sql = await global.pgp.as.format(sql,[id_noticia, id_persona, likeado]);
        console.log('LIKE NOTICIA sql->>>', sql);
        global.dbp.one(sql).then(data=>{
            return resolve(data);
        }).catch(err =>{
            return reject(err);
        });
    })

}
function guardarNoticia(id_noticia, id_persona, guardado){
    return new Promise(async (resolve, reject)=>{
        let sql = 'SELECT __offside_4_guardar_noticia($1, $2, $3) res'; 
        sql = await global.pgp.as.format(sql,[id_noticia, id_persona, guardado]);
        console.log('GUARDAR NOTICIA sql->>>', sql);
        global.dbp.one(sql).then(data=>{
            return resolve(data.res);
        }).catch(err =>{
            return reject(err);
        });
    })

}

module.exports = {
    getUsuario,
    getAllNoticias,
    getNoticia,
    crearNoticia,
    editarNoticia,
    borrarNoticia,
    getTags,
    likeNoticia,
    guardarNoticia,
    login
}