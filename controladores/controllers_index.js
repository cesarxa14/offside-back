const models = require('../modelos/models_index');

async function getAllNoticias(req, res){
    try{
        let news = await models.getAllNoticias();
        console.log('news', news);
        return res.send(news);
    } catch(err){

    }
}

module.exports = {
    getAllNoticias
}