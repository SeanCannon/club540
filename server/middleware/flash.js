/**
 * Set flash message
 * @param req
 * @param res
 * @param next
 */
function setFlash (req, res, next) {
  'use strict';
  res.locals.flash = {
    notice : req.flash('notice'),
    error  : req.flash('error')
  };
  next();
}

module.exports = setFlash;