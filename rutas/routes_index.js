const {Router} = require('express');
const controllers = require('../controladores/controllers_index')

const router = Router();


router.get('/', async(req,res)=>{
    res.send('HOlaaaa cacas');
})

router.get('/api/general',controllers.getAllNoticias);

router.post('/signup', (req, res)=>{
    const {correo, password} = req.body;
    console.log(correo, password);
    res.json('Testing');
})


module.exports = router;