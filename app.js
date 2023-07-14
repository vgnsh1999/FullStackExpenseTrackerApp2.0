const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json({extended:false}));

const User = require('./models/User');
const Expense = require('./models/Expense');

const sequelize = require('./util/database');

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);

//one to many relationship
User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync().then((response)=>{
    console.log(response);
    app.listen(5000);
}).catch(error=>console.log(error));