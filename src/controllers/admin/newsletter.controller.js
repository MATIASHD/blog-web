const newsletterService = require('../../services/newsletter.service');
const ApiResponse = require('../../utils/response');
const STATUS = require('../../constants/status');

const getNewsletterAdmin = (req, res, next) => {
  try {
    const subscribers = newsletterService.getAllSubscribers();
    const stats = {
      total: subscribers.length,
      subscribed: subscribers.filter(s => s.status === 'subscribed').length,
      unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length
    };

    res.render('pages/newsletter', {
      title: 'Newsletter Management',
      subscribers,
      stats
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubscriber = (req, res, next) => {
  try {
    newsletterService.unsubscribe(req.params.email);
    res.json({
      success: true,
      message: 'Subscriber removed'
    });
  } catch (error) {
    res.status(STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

const exportSubscribers = (req, res, next) => {
  try {
    const subscribers = newsletterService.getAllSubscribers()
      .filter(s => s.status === 'subscribed');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"');

    const csv = ['email,name,subscriptionDate'].concat(
      subscribers.map(s => `${s.email},"${s.name}",${s.subscriptionDate}`)
    ).join('\n');

    res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNewsletterAdmin,
  deleteSubscriber,
  exportSubscribers
};
