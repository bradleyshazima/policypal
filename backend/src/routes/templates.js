const express = require('express');
const { body } = require('express-validator');
const templateController = require('../controllers/templateController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation rules
const templateValidation = [
  body('name').trim().notEmpty(),
  body('message').trim().notEmpty(),
  body('category').optional().trim(),
];

// Routes
router.get('/', templateController.getAllTemplates);
router.get('/:id', templateController.getTemplate);
router.post('/', templateValidation, templateController.createTemplate);
router.put('/:id', templateValidation, templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;