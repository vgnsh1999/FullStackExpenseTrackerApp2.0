const User = require('../models/User');

const addUser = async(req,res,next)=>{
    try{
        // const username = req.body.username;
        // const email = req.body.email;
        // const password = req.body.password;
        const {username,email,password} = req.body;

        const data = await User.create({username:username,email:email,password:password});
        //res.status(201).json({newUserAdded:data});
        res.status(201).json({message:'New user added'});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({error:error});
    }
};

const loginUser = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        const userEmail = await User.findOne({where:{email:email}});
        const userPassword = await User.findOne({where:{password:password}});
        if(userEmail && userPassword){
            res.status(200).json({success:true,message:'User login sucessful'});
        }else if(userEmail && !userPassword){
           res.status(401).json({success:false,message:'User not authorized'});
        } else if(!userEmail){
            res.status(404).json({success:false,message:'User not found'});
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