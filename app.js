const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json({extended:false}));

const User = require('./models/User');

const sequelize = require('./util/database');


app.post('/user/signup',async(req,res,next)=>{
    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const data = await User.create({username:username,email:email,password:password});
        res.status(201).json({newUserAdded:data});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({error:error});
    }
});



sequelize.sync().then((response)=>{
    console.log(response);
    app.listen(5000);
}).catch(error=>console.log(error));