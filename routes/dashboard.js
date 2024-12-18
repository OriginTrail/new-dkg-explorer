const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Define your routes here
router.get('/dashboard-data', dashboardController.getDashboardData);

module.exports = router;