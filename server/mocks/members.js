var payloads = {
  members: require("./fixtures/members.json")
};

module.exports = function(app) {
  var express = require('express');
  var membersRouter = express.Router();

  membersRouter.get('/', function(req, res) {
    res.send(payloads.members);
  });

  membersRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  membersRouter.get('/:id', function(req, res) {
    var memArr = payloads.members.members;
    var member = {};
    var id = parseInt(req.params.id);

    for (var i = 0, len = memArr.length; i < len; i++) {
      if (id === memArr[i].id) {
        member = memArr[i];
      }
    }

    res.send({ 'member': member });
  });

  membersRouter.put('/:id', function(req, res) {
    res.send({
      'members': {
        id: req.params.id
      }
    });
  });

  membersRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/members', membersRouter);
};
