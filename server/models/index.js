const sequelize = require('../config/db');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Store has one Owner (User)
Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

// Users have many Ratings
User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

// Stores have many Ratings
Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

module.exports = { sequelize, User, Store, Rating };