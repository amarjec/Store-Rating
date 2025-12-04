const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('Store', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  }
});

module.exports = Store;