const contactService = require('../../services/contact.service');
const ApiResponse = require('../../utils/response');
const STATUS = require('../../constants/status');

const getAllContacts = (req, res, next) => {
  try {
    const contacts = contactService.getAllContacts();
    res.render('pages/contacts', {
      title: 'Contact Messages',
      contacts
    });
  } catch (error) {
    next(error);
  }
};

const getContactDetail = (req, res, next) => {
  try {
    const contact = contactService.getContactById(req.params.id);
    if (!contact) {
      return res.status(STATUS.NOT_FOUND).render('pages/404', {
        title: 'Contact Not Found'
      });
    }

    res.render('pages/contact-detail', {
      title: `Message from ${contact.name}`,
      contact
    });
  } catch (error) {
    next(error);
  }
};

const updateContactStatus = (req, res, next) => {
  try {
    const { status } = req.body;
    contactService.updateContactStatus(req.params.id, status);

    res.json({
      success: true,
      message: 'Status updated'
    });
  } catch (error) {
    res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

const deleteContact = (req, res, next) => {
  try {
    contactService.deleteContact(req.params.id);
    res.json({
      success: true,
      message: 'Contact deleted'
    });
  } catch (error) {
    res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllContacts,
  getContactDetail,
  updateContactStatus,
  deleteContact
};
