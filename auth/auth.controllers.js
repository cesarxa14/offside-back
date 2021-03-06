const User = require('./auth.dao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'secretkey';

exports.createUser = (req, res, next) => {
    const newUser = {
        name: req.body.name,
        name: req.body.email,
        name: req.body.password
    }

    User.create(newUser, (err, user)=>{
        if(err) return res.status(500).send('Server error');
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id:user.id},
                                       SECRET_KEY,
                                       {expiresIn: expiresIn});
        res.send({ user });
    })
}

exports.loginUser = (req, res, next) =>{
    const userData = {
        email: req.body.email,
        password: req.body.password
    }

    User.findOne ({email: userData.email}, (err,user)=>{
        if(err) return res.status(500).send('Server error!');
        if(!user) {
            res.status(409).send({message: 'Something is wrong'})
        }else{
            const resultPassword
        }
    })
}