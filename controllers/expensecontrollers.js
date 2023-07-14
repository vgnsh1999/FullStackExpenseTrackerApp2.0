const Expense = require('../models/Expense');

const addExpense = async (req,res,next)=>{
    try{
        //console.log('hi')
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const data = await Expense.create({amount:amount,description:description,category:category}); 
        res.status(201).json({newExpenseAdded:data});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({error:error});
    }
};

const getExpense = async (req,res,next)=>{
    try{
        const expenses = await Expense.findAll({where:{userId:req.user.id}});
        res.status(200).json({allExpenses:expenses});
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({error:error});
    }
};

const deleteExpense = async (req,res,next)=>{
    try{
        const expenseID = req.params.id;
        await Expense.destroy({where:{id:expenseID}});
        res.sendStatus(200);
    } catch(error){
        console.log(JSON.stringify(error));
        res.status(500).json({error:error});
    }
};

module.exports = {
    addExpense,
    getExpense,
    deleteExpense
};