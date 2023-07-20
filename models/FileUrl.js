const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const FileUrl = sequelize.define('fileurl',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type:Sequelize.INTEGER
    },
    fileUrl:Sequelize.STRING,
    date:Sequelize.DATE
});

module.exports = FileUrl;