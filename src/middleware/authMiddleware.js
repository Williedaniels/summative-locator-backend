module.exports = (req, res, next) => {
    // Example authentication logic
    console.log('Auth middleware triggered');
    next();
};
