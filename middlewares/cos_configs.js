module.exports = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Content-Type, Accept, X-HTTP-Method-Override');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
    res.end();
  } else {
    next();
  }
}
