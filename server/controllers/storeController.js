const { Store, Rating, User, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.createStore = async (req, res) => {
  try {
    const { name, address, email, ownerId } = req.body;
    const store = await Store.create({ name, address, email, ownerId });
    res.status(201).json(store);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getAllStores = async (req, res) => {
  const { search } = req.query; 
  
  const whereClause = search ? {
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { address: { [Op.iLike]: `%${search}%` } }
    ]
  } : {};

  try {
    const stores = await Store.findAll({
      where: whereClause,
      include: [
        { 
          model: Rating,
          attributes: [] 
        }
      ],
      attributes: {
        include: [
          [sequelize.fn('AVG', sequelize.col('Ratings.rating')), 'overallRating'],
          [sequelize.fn('COUNT', sequelize.col('Ratings.id')), 'ratingCount']
        ]
      },
      group: ['Store.id']
    });
    res.json(stores);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id; 


    const store = await Store.findOne({
      where: { ownerId },
      include: [
        {
          model: Rating,
          include: [{ model: User, attributes: ['name', 'email'] }] 
        }
      ]
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner." });
    }


    const ratings = store.Ratings || [];
    const totalScore = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? (totalScore / ratings.length).toFixed(1) : 0;

    res.json({
      storeName: store.name,
      address: store.address,
      averageRating,
      ratingCount: ratings.length,
      ratings: ratings 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getAllStores = async (req, res) => {
  const { search } = req.query;
  const currentUserId = req.user.id; 

  const whereClause = search ? {
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { address: { [Op.iLike]: `%${search}%` } }
    ]
  } : {};

  try {
    const stores = await Store.findAll({
      where: whereClause,
      attributes: {
        include: [

          [
            sequelize.literal(`(
              SELECT AVG(rating)
              FROM "Ratings" AS "r"
              WHERE "r"."storeId" = "Store"."id"
            )`),
            'overallRating'
          ],

          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM "Ratings" AS "r"
              WHERE "r"."storeId" = "Store"."id"
            )`),
            'ratingCount'
          ],

          [
            sequelize.literal(`(
              SELECT rating
              FROM "Ratings" AS "r"
              WHERE "r"."storeId" = "Store"."id"
              AND "r"."userId" = ${currentUserId}
            )`),
            'myRating' 
          ]
        ]
      },
      order: [['name', 'ASC']]
    });

    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};