const {Router} = require('express');
const controllers = require('../controladores/controllers_index')
const multer = require('multer');
const path = require('path')
const router = Router();

const upload = multer({dest:'upload',
storage: multer.diskStorage({
    destination:'upload',
    filename: (req,file,cb) =>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})
})
router.get('/', async(req,res)=>{
    res.send('HOlaaaa cacas');
})

router.get('/api/general/getUSuario',controllers.getUsuario);
router.get('/api/general/getAllNoticias',controllers.getAllNoticias);
router.get('/api/general/getNoticia',controllers.getNoticia);
router.get('/api/general/getTags',controllers.getTags);
router.get('/api/general/protected', controllers.ensureToken, controllers.protected);
router.post('/api/general/login',controllers.login);
router.post('/api/general/crearNoticia',upload.single('foto'), controllers.crearNoticia);
router.post('/api/general/editarNoticia',upload.single('foto'), controllers.editarNoticia);
router.post('/api/general/borrarNoticia', controllers.borrarNoticia);
router.post('/api/general/likeNoticia', controllers.likeNoticia);
router.post('/api/general/guardarNoticia', controllers.guardarNoticia);


module.exports = router;