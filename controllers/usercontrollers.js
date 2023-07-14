const e = require('cors');
const User = require('../models/User');
const bcrypt = require('bcrypt');

function isstringinvalid(string){
    if(string === undefined || string.length ===0){
        return true;
    } else {
        return false;
    }
}

const signup = async(req,res,next)=>{
    try{
        //3.Using bcrypt
        const {username,email,password} = req.body;
        const saltrounds = 10;
        if(isstringinvalid(username) || isstringinvalid(email || isstringinvalid(password))){
            return res.status(400).json({err:'Bad parameters.Something is missing'});
        }
        bcrypt.hash(password , saltrounds , async(err,hash)=>{
            console.log(err);
            await User.create({username:username,email:email,password:hash});
            res.status(201).json({message:'Succesfully created new user'});
        });
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({error:error});
    }
};

const login = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        //Using bcrypt
        const user = await User.findAll({where:{email}})
        if(user.length > 0){
            bcrypt.compare(password , user[0].password ,(err,result)=>{
                if(err){
                    throw new Error('Something went wrong!');
                }
                if(result === true){
                    res.status(200).json({success:true,message:'User logged in successfully'});
                } else {
                    return res.status(400).json({success:false,message:'Password is incorrect'});
                }
            });
        } else {
            return res.status(401).json({success:false,message:'User does not exist'});
        }
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({success:false,message:error});
    }
};

module.exports = {
    signup,
    login
};