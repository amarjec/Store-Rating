const { Rating } = require('../models');

exports.submitRating = async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.id;

  try {
    // Check if rating exists 
    const existingRating = await Rating.findOne({ where: { userId, storeId } });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({ message: "Rating updated", data: existingRating });
    }

    const newRating = await Rating.create({ userId, storeId, rating });
    res.status(201).json({ message: "Rating submitted", data: newRating });
  } catch (err) { res.status(500).json({ error: err.message }); }
};