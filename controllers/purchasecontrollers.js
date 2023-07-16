const Razorpay = require('razorpay');
const Order = require('../models/Order');
const userController = require('../controllers/usercontrollers');
require('dotenv').config();

const purchasepremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

 const updateTransactionStatusSuccess = async (req, res ) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}}) 
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ ispremiumuser: true }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({sucess: true, message: "Transaction Successful", token: userController.generateAccessToken(userId,undefined , true) });
        }).catch((error) => {
            throw new Error(error);
        })      
                
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' });

    }
}

const updateTransactionStatusFail = async (req, res ) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}}) 
        const promise1 =  order.update({ paymentid: payment_id, status: 'FAILED'}) 
        const promise2 =  req.user.update({ ispremiumuser: false }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({sucess: false, message: "Transaction Failed", token: userController.generateAccessToken(userId,undefined , false) });
        }).catch((error) => {
            throw new Error(error);
        })      
                
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' });

    }
}

const getStatus = async (req,res,next)=>{
    try{
        const status = await Order.findOne({ where: { userId:req.user.id , status:'SUCCESSFUL' }});
        return res.status(200).json({allStatus:status,success:true});
    } catch(err){
        console.log(JSON.stringify(err));
        res.status(403).json({error:err,message: 'Something went wrong'});
    }
};

module.exports = {
    purchasepremium,
    updateTransactionStatusSuccess,
    updateTransactionStatusFail,
    getStatus
}