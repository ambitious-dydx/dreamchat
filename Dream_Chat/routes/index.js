var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dream Chat' });
});

module.exports = router;

module.exports.chatroom=function(req, res){
  res.render('chatroom', {title : 'Dream Chat'});
}

module.exports.rooms = function(req, res){
  res.render('rooms', { title: 'Dream Chat' });
}