const express = require('express');
const router = express.Router();
const contactsController = require('../../controllers/admin/contacts.controller');

router.get('/contacts', contactsController.getAllContacts);
router.get('/contacts/:id', contactsController.getContactDetail);
router.post('/contacts/:id/status', contactsController.updateContactStatus);
router.post('/contacts/:id/delete', contactsController.deleteContact);

module.exports = router;
