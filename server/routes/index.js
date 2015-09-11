/*jslint node: true */
'use strict';

var express = require('express');
var router  = express.Router();

var userAgentUtils = require('../utils/userAgent');

function index(req, res) {
  var userAgent    = req.headers['user-agent'].toLowerCase(),
      browserClass = userAgentUtils.getBrowserClass(userAgent);

  res.render('layout', {
    ip           : req.header('X-Real-Ip'),
    cacheRev     : process._cacheRev,
    browserClass : browserClass
  });

}

router.get('/', index);
router.get('/users', index);
router.get('/chat', index);
router.get('/tricktionary', index);
router.get('/tricktionary/*', index);

router.get('/pages/:name', function(req, res) {
  res.render('pages/' + req.params.name, req.params);
});

router.get('/partials/:dir/:name', function(req, res) {
  res.render('partials/' + req.params.dir + '/' + req.params.name, req.params);
});

router.get('/partials/:name', function(req, res) {
  res.render('partials/' + req.params.name, req.params);
});

module.exports = router;
