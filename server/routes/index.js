const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const storeController = require('../controllers/storeController');
const ratingController = require('../controllers/ratingController');

// --- Auth Routes ---
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/change-password', verifyToken, authController.changePassword);

// --- Admin Routes ---
router.get('/admin/dashboard', verifyToken, checkRole(['admin']), adminController.getDashboard);
router.post('/admin/users', verifyToken, checkRole(['admin']), adminController.addUser);
router.get('/admin/users', verifyToken, checkRole(['admin']), adminController.getUsers);
router.post('/admin/stores', verifyToken, checkRole(['admin']), storeController.createStore);
router.get('/admin/stores', verifyToken, checkRole(['admin']), storeController.getAllStores);

// --- Normal User Routes ---
router.get('/stores', verifyToken, storeController.getAllStores);
router.post('/rating', verifyToken, checkRole(['normal_user']), ratingController.submitRating);
router.get('/owner/dashboard', verifyToken, checkRole(['store_owner']), storeController.getOwnerDashboard);





module.exports = router;