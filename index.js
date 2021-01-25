const express = require('express');
const app = express();
const db = require('./bd/index');
const path = require ('path');
const jwt = require('jsonwebtoken');
const jwtKey = 'my_jwt_key';


db.connectDB();

app.set('port',process.env.PORT || 3000)

app.use(express.json())
app.use('/upload', express.static(path.resolve('upload')));
app.use(express.static(path.join(__dirname, '../offside-front')));
app.use(require('./rutas/routes_index'));
app.listen(app.get('port'), ()=>{
    console.log('Server on Port', app.get('port'));
});