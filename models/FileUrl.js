const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const FileUrl = sequelize.define('fileurl',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    fileUrl:Sequelize.STRING,
});

module.exports = FileUrl;