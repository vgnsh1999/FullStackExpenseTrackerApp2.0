const e = require('cors');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const addUser = async(req,res,next)=>{
    try{
        //1.
        // const username = req.body.username;
        // const email = req.body.email;
        // const password = req.body.password;
        //res.status(201).json({newUserAdded:data});
        //2.
        // const {username,email,password} = req.body;
        // const data = await User.create({username:username,email:email,password:password});
        // res.status(201).json({message:'New user added'});
        //3.Using bcrypt
        const {username,email,password} = req.body;
        const saltrounds = 10;
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

const loginUser = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        // const userEmail = await User.findOne({where:{email:email}});
        // const userPassword = await User.findOne({where:{password:password}});
        // if(userEmail && userPassword){
        //     res.status(200).json({success:true,message:'User login sucessful'});
        // }else if(userEmail && !userPassword){
        //    res.status(401).json({success:false,message:'User not authorized'});
        // } else if(!userEmail){
        //     res.status(404).json({success:false,message:'User not found'});
        // }
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
        res.status(500).json({error:error});
    }
};

module.exports = {
    addUser,
    loginUser
};