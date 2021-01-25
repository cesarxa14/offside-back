const models = require('../modelos/models_index');
const multer = require('multer');
const jwt    = require('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const { nextTick, send } = require('process');
const { Console } = require('console');
var _encryptor = require('simple-encryptor')('secret_server_key');



function ensureToken(req,res, next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !=='undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else{
        res.sendStatus(403);
    }
}

async function getUsuario(req, res){
    try{
        console.log(req.query);
        let metadata = req.query.metadata;
        metadata = _encryptor.decrypt(metadata.replace(/ /g, '+'));
        let id_persona = metadata.id_persona;
        let usuario = await models.getUsuario(id_persona);
        // console.log(usuario);
        res.send(usuario);
    } catch(err){

    }
}

async function getNoticia(req, res){
    try{
        console.log(req.query);
        let id_noticia = req.query.id_noticia;
        id_noticia = _encryptor.decrypt(id_noticia.replace(/ /g, '+'));
        let noti = await models.getNoticia(id_noticia);
        console.log(noti);
        noti.id_noticia = _encryptor.encrypt(noti.id_noticia);
        noti.id_persona = _encryptor.encrypt(noti.id_persona);
        res.send(noti);
    } catch(err){

    }
}


async function getAllNoticias(req, res){
    try{

        console.log('params', req.query);
        let metadata = req.query.metadata;
        metadata = _encryptor.decrypt(metadata.replace(/ /g, '+'));
        let id_persona = metadata.id_persona;
        console.log(metadata)
        let news = await models.getAllNoticias(id_persona);
        // console.log('news 1', news);
        let fut_peruano = news.filter(row=>{
            return row.id_tag == 1;
        });
        let champions = news.filter(row=>{
            return row.id_tag == 2;
        });
        let premier = news.filter(row=>{
            return row.id_tag == 3;
        });
        let laliga = news.filter(row=>{
            return row.id_tag == 4;
        });
        let serieA = news.filter(row=>{
            return row.id_tag == 5;
        });
        
        // console.log('futbol peruano',fut_peruano)
        news.map(row=>{
            row.id_noticia = _encryptor.encrypt(row.id_noticia);
        })

        let filtro = {
            todos : news,
            fut_peruano : fut_peruano,
            champions : champions,
            premier : premier,
            laliga: laliga,
            seriaA: serieA 
        }

        return res.send(filtro);
    } catch(err){

    }
}

async function getTags(req, res){
    try{
        let tags = await models.getTags();
        // console.log('tags', tags);
        return res.send(tags);
    } catch(err){

    }
}

async function likeNoticia(req,res){
    try{
        // console.log(req.body);
        let id_noticia = req.body.id_noticia;
        id_noticia = _encryptor.decrypt(id_noticia.replace(/ /g, '+'))
        let likeado = req.body.likeado;
        let metadata = req.body.metadata;
        metadata = _encryptor.decrypt(metadata.replace(/ /g, '+'));
        let id_persona = metadata.id_persona;
        console.log(id_persona)
        console.log(id_noticia)
        console.log(likeado)
        let like = await models.likeNoticia(id_noticia, id_persona, likeado)
        res.send(like);
    } catch(err){

    }
}

async function guardarNoticia(req,res){
    try{
        console.log(req.body);
        let id_noticia = req.body.id_noticia;
        id_noticia = _encryptor.decrypt(id_noticia.replace(/ /g, '+'))
        let guardado = req.body.guardado;
        let metadata = req.body.metadata;
        metadata = _encryptor.decrypt(metadata.replace(/ /g, '+'));
        let id_persona = metadata.id_persona;
        console.log(id_persona)
        console.log(id_noticia)
        console.log(guardado)
        let guardar = await models.guardarNoticia(id_noticia, id_persona, guardado);
        res.send(guardar);
    } catch(err){

    }
}



async function login(req, res){
    try{
       console.log('req body', req.body)
       let usuario = req.body.usuario;
       let password = req.body.password;

       if(!usuario) throw { msj: 'Usuario inválido', status: 400};
       if(!password) throw { msj: 'Contraseña inválida', status: 400};

        
        const token = jwt.sign({usuario, password}, 'my_secret_key');
        let login = await models.login(usuario,password);
        if(login.status == 1){
            throw {status: 1, msj: login.msj};
        }
        console.log(login)
        let id_persona = login.metadata.id_persona.toString();
        login.metadata = _encryptor.encrypt(login.metadata);
 
        
        let respuesta = {
            token: token,
            msj: login.msj,
            status: login.status,
            metadata : login.metadata
        };
        return res.status(200).send(respuesta); 
        
    } catch(err){
        console.log('err',err)
         return res.send(err);
        
    }
}

async function protected(req,res){
    try{
        jwt.verify(req.token, 'my_secret_key', function(err, data){
            if(err){
                res.sendStatus(403);
            } else {
                res.json({
                    text: 'this is protected',
                    data : data
                })
            }
        })
        res.send({'protected':'ok'});
    } catch(err){

    }
}

async function crearNoticia(req,res){
    try{
        //tiene que mandar tbn el id de la persona que esta publicando la noticia
        console.log('body 102', req.body)

        let metadata = req.body.metadata;
        metadata = _encryptor.decrypt(metadata);
        let id_persona = metadata.id_persona;
        let titulo = req.body.titulo; 
        let subtitulo = req.body.subtitulo;
        let cuerpo = req.body.cuerpo;
        let id_tag = parseInt(req.body.tag);
        let foto = req.file.filename;
        let noticia = await models.crearNoticia(id_persona, titulo, subtitulo, cuerpo, id_tag, foto);
        console.log(noticia)
        if(noticia && noticia.noticia_creada) {
            noticia.noticia_creada.id_noticia = _encryptor.encrypt(noticia.noticia_creada.id_noticia);
            noticia.noticia_creada.id_persona = _encryptor.encrypt(noticia.noticia_creada.id_persona);
        }
        res.send(noticia);
    } catch(err){

    }
}
async function editarNoticia(req,res){
    try{
        //tiene que mandar tbn el id de la persona que esta publicando la noticia
        console.log('body 229', req.body)
        let metadata = req.body.metadata;
        metadata = _encryptor.decrypt(metadata);
        let id_noticia = req.body.id_noticia;
        id_noticia = _encryptor.decrypt(id_noticia.replace(/ /g, '+'));
        let id_persona = metadata.id_persona;
        let titulo = req.body.titulo; 
        let subtitulo = req.body.subtitulo;
        let cuerpo = req.body.cuerpo;
        let id_tag = parseInt(req.body.tag);
        let edit = await models.editarNoticia(id_noticia, id_persona, titulo, subtitulo, cuerpo, id_tag);
        console.log(edit);

        // if(edit && noticia.noticia_creada) {
        //     noticia.noticia_creada.id_noticia = _encryptor.encrypt(noticia.noticia_creada.id_noticia);
        //     noticia.noticia_creada.id_persona = _encryptor.encrypt(noticia.noticia_creada.id_persona);
        // }
        res.send(edit);
    } catch(err){

    }
}
async function borrarNoticia(req,res){
    try{
        console.log('body 254', req.body);
        let id_noticia = req.body.id_noticia;
        id_noticia = _encryptor.decrypt(id_noticia.replace(/ /g, '+'));
        let borrar = await models.borrarNoticia(id_noticia);
        console.log(borrar)
        res.send(borrar);
       
        // res.send(edit);
    } catch(err){

    }
}

module.exports = {
    ensureToken,
    getAllNoticias,
    getNoticia,
    login,
    protected,
    crearNoticia,
    editarNoticia,
    borrarNoticia,
    likeNoticia,
    guardarNoticia,
    getUsuario,
    getTags
}