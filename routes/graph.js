const express = require('express');
const router = express.Router();
const knowledgeGraphController = require('../controllers/knowledgeGraphController');

router.get('/get', knowledgeGraphController.get);

module.exports = router;
