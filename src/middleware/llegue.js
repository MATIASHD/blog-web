const llegueMiddleware = (req, res, next) => {
  console.log('Llegue al middleware');
  next();
};

module.exports =  llegueMiddleware;