function log(req, res, next){
    // next is a reference to the next function in the req pipeline 
    console.log('Logging ...')
    next();
  }


  module.exports = log;