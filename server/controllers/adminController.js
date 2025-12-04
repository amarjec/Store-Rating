const bcrypt = require('bcryptjs');
const { validatePassword } = require('../middleware/authMiddleware');
const { User, Store, Rating, sequelize } = require('../models'); 

exports.getDashboard = async (req, res) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();
    res.json({ users, stores, ratings });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addUser = async (req, res) => {
  // Admin can add ANY user role
  const { name, email, password, address, role } = req.body;
  
  if (!validatePassword(password)) return res.status(400).json({ message: "Invalid Password Format" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address, role });
    res.status(201).json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getUsers = async (req, res) => {

  const { sortBy, order } = req.query;
  const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const sortField = sortBy || 'createdAt';

  try {
    const users = await User.findAll({
      order: [[sortField, sortOrder]]
    });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
};



exports.getUsers = async (req, res) => {
  const { sortBy, order } = req.query;
  const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const sortField = sortBy || 'createdAt';

  try {
    const users = await User.findAll({
      attributes: { 
        include: [

            [
                sequelize.literal(`(
                    SELECT AVG(rating) 
                    FROM "Ratings" AS "r"
                    JOIN "Stores" AS "s" ON "r"."storeId" = "s"."id"
                    WHERE "s"."ownerId" = "User"."id"
                )`),
                'ownerRating'
            ]
        ]
      },
      order: [[sortField, sortOrder]]
    });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
};