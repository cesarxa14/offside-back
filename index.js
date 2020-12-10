const express = require('express');
const app = express();
const db = require('./bd/index');
const jwt = require('jsonwebtoken');
const jwtKey = 'my_jwt_key';


db.connectDB();

app.set('port',process.env.PORT || 3000)

app.use(express.json())
app.use(require('./rutas/routes_index'));
app.listen(app.get('port'), ()=>{
    console.log('Server on Port', app.get('port'));
});