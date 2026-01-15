const express = require('express');
const { body } = require('express-validator');
const reminderController = require('../controllers/reminderController');
const { authenticateToken } = require('../middleware/auth');
const { checkSubscription, checkSMSQuota } = require('../middleware/subscription');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);
router.use(checkSubscription);

// Validation rules
const manualReminderValidation = [
  body('clientIds').isArray().notEmpty(),
  body('message').trim().notEmpty(),
  body('deliveryMethod').isIn(['sms', 'whatsapp', 'email']),
];

// Routes
router.get('/', reminderController.getAllReminders);
router.get('/statistics', reminderController.getStatistics);
router.post('/send', checkSMSQuota, manualReminderValidation, reminderController.sendManualReminder);

module.exports = router;