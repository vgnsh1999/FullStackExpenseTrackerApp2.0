const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
    );

const cors = require('cors');
const app = express();
app.use(helmet());
app.use(morgan('combined',{stream:accessLogStream}));
app.use(cors());
app.use(bodyParser.json({extended:false}));

const User = require('./models/User');
const Expense = require('./models/Expense');
const Order = require('./models/Order');
const Forgotpassword = require('./models/ForgotPassword');

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premium');
const forgotPasswordRoutes = require('./routes/forgot');

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumFeatureRoutes);
app.use('/password',forgotPasswordRoutes);

app.use((req,res)=>{
    console.log('url',req.url);
    res.sendFile(path.join(__dirname,`views/${req.url}`));
})

//one to many relationship
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync().then((response)=>{
    console.log(response);
    app.listen(process.env.PORT||3000);
}).catch(error=>console.log(error));