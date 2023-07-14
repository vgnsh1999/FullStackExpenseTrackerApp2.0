const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = (req,res,next)=>{
    try{
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token,'secretkey');
        console.log(user.userid)
        User.findByPk(user.userid).then(user=>{
            req.user = user;
            next();
        })
    } catch(err){
        console.log(err);
        return res.status(401).json({success:false});
    }
};

module.exports = {
    authenticate
};