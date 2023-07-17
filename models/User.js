const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    username: Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:Sequelize.STRING,
    ispremiumuser:Sequelize.BOOLEAN,
    totalExpense:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }
});

module.exports = User;