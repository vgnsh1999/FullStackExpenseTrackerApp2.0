const Expense = require('../models/Expense');
const User = require('../models/User');
const FileUrl = require('../models/FileUrl')
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
require('dotenv').config();

const addExpense = async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const {amount,description,category} = req.body;
        if(amount === undefined || amount.length === 0){
            return res.status(400).json({message:'Parameters are missing',success:false});
        }

        const data = await Expense.create({amount, description, category, userId: req.user.id},{transaction:t}); 
        const totalExpense = Number(req.user.totalExpense) + Number(amount);
        await User.update({
            totalExpense: totalExpense
        },{where : {id:req.user.id},
           transaction : t 
        });
        await t.commit();
        res.status(201).json({newExpenseAdded:data,success:true});
    } catch(error){
        await t.rollback();
        return res.status(500).json({message:error,success:false});
    }
};


const getExpense = async (req,res,next)=>{
    try{
        const expenses = await Expense.findAll({limit: 5, where: { userId:req.user.id }});
        res.status(200).json({allExpenses:expenses,success:true});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({message:error,success:false});
    }
};


const getExpenseOnPage2 = async (req,res,next)=>{
    try{
        const expenses = await Expense.findAll({ limit: 5, offset:5 ,where: { userId:req.user.id }});
        res.status(200).json({allExpenses:expenses,success:true});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({message:error,success:false});
    }
};

const deleteExpense = async (req,res,next)=>{
    const t = await sequelize.transaction();
    try{
        const expenseID = req.params.id;
        if(expenseID === undefined || expenseID.length === 0){
            return res.status(400).json({message:'Expense ID is missing',success:false});
        }
        const amountToBeDeleted = await Expense.findAll({where:{id:expenseID}});
        const totalExpense = Number(req.user.totalExpense) - amountToBeDeleted[0].amount;
        await User.update({
            totalExpense: totalExpense
        },{where : {id:req.user.id},
           transaction : t 
        });
        const noofrows = await Expense.destroy({where:{id:expenseID,userId:req.user.id},transaction:t});
        if(noofrows === 0){
            return res.status(404).json({message:'expense doesnot belongs to user'});
        }
        await t.commit();
        res.status(200).json({message:'Deleted Successfully',success:true});
    } catch(error){
        await t.rollback();
        console.log(error)
        return res.status(500).json({message:error,success:false});
    }
};

const downloadexpense = async (req,res,next) =>{
    try{
        const expenses = await Expense.findAll({ where: { userId:req.user.id }});
        console.log(expenses);
        //we have to stringify before sending it to file
        const stringifiedExpenses = JSON.stringify(expenses);
        //filename should be depended upon userID
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await uploadToS3(stringifiedExpenses,filename);
        const data = await FileUrl.create({userId:req.user.id,fileUrl:fileUrl});
        res.status(200).json({fileUrl:fileUrl,success:true});

    } catch(error){
        console.log(error);
        return res.status(500).json({fileUrl:'',error:error,success:false});
    }
};

const download = async (req,res,next)=>{
    try{
        const fileUrls = await FileUrl.findAll({where:{userId:req.user.id}});
        res.status(200).json({allFiles:fileUrls,success:true});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({message:error,success:false});
    }
};

function uploadToS3(data,filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    });

        var params = {
          Bucket: BUCKET_NAME,
          Key: filename,
          Body: data,
          ACL: 'public-read'
        }
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,s3response)=>{
                if(err){
                    console.log('Something went wrong',err);
                    reject(err)
                } else {
                    console.log('success',s3response)
                    resolve(s3response.Location);
                }
            })
        })
}

module.exports = {
    addExpense,
    getExpense,
    deleteExpense,
    downloadexpense,
    download,
    getExpenseOnPage2
};