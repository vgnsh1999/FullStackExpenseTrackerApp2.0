const Expense = require('../models/Expense');

const addExpense = async (req,res,next)=>{
    try{
        const {amount,description,category} = req.body;
        if(amount === undefined || amount.length === 0){
            return res.status(400).json({message:'Parameters are missing',success:false});
        }

        const data = await Expense.create({amount, description, category, userId: req.user.id}); 
       res.status(201).json({newExpenseAdded:data,success:true});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({message:error,success:false});
    }
};


const getExpense = async (req,res,next)=>{
    try{
        const expenses = await Expense.findAll({ where: { userId:req.user.id }});
        res.status(200).json({allExpenses:expenses,success:true});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({message:error,success:false});
    }
};

const deleteExpense = async (req,res,next)=>{
    try{
        const expenseID = req.params.id;
        if(expenseID === undefined || expenseID.length === 0){
            return res.status(400).json({message:'Expense ID is missing',success:false});
        }
        const noofrows = await Expense.destroy({where:{id:expenseID,userId:req.user.id}});
        if(noofrows === 0){
            return res.status(404).json({message:'expense doesnot belongs to user'});
        }
        res.status(200).json({message:'Deleted Successfully',success:true});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({message:error,success:false});
    }
};

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
};