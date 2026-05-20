const postService = require('../../services/post.service');
const contactService = require('../../services/contact.service');
const newsletterService = require('../../services/newsletter.service');
const ApiResponse = require('../../utils/response');

const getDashboard = (req, res, next) => {
  try {
    const posts = postService.getAllPosts();
    const contacts = contactService.getAllContacts();
    const unreadContacts = contacts.filter(c => !c.read).length;
    const subscribers = newsletterService.getSubscribedCount();

    const stats = {
      totalPosts: posts.length,
      totalContacts: contacts.length,
      unreadContacts,
      subscribers,
      recentPosts: posts.slice(0, 5),
      recentContacts: contacts.slice(-5).reverse()
    };

    ApiResponse.render(res, 'pages/dashboard', {
      title: 'Admin Dashboard',
      stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard
};
