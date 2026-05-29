const express = require('express');
const router = express.Router();
const newsletterController = require('../../controllers/admin/newsletter.controller');

router.get('/newsletter', newsletterController.getNewsletterAdmin);
router.get('/newsletter/export', newsletterController.exportSubscribers);
router.post('/newsletter/:email/delete', newsletterController.deleteSubscriber);

module.exports = router;
