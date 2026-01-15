const express = require('express');
const { body } = require('express-validator');
const clientController = require('../controllers/clientController');
const { authenticateToken } = require('../middleware/auth');
const { checkSubscription, checkClientLimit } = require('../middleware/subscription');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);
router.use(checkSubscription);

// Validation rules
const clientValidation = [
  body('full_name').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('car_make').trim().notEmpty(),
  body('car_model').trim().notEmpty(),
  body('insurance_type').trim().notEmpty(),
  body('expiry_date').isISO8601(),
];

// Routes
router.get('/', clientController.getAllClients);
router.get('/expiring', clientController.getExpiringClients);
router.get('/:id', clientController.getClient);
router.post('/', checkClientLimit, clientValidation, clientController.createClient);
router.put('/:id', clientValidation, clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;