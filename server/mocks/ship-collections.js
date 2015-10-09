var payloads = {
  shipCollections: require("./fixtures/ship-collections.json")
};

module.exports = function(app) {
  var express = require('express');
  var shipCollectionsRouter = express.Router();

  shipCollectionsRouter.get('/', function(req, res) {
    res.send(payloads.shipCollections);
  });

  shipCollectionsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  shipCollectionsRouter.get('/:id', function(req, res) {
    var arr = payloads.shipCollections.shipCollections;
    var record = {};
    var id = parseInt(req.params.id);

    for (var i = 0, len = arr.length; i < len; i++) {
      if (id === arr[i].id) {
        record = arr[i];
      }
    }

    res.send({ 'shipCollection': record });
  });

  shipCollectionsRouter.put('/:id', function(req, res) {
    res.send({
      'ship-collections': {
        id: req.params.id
      }
    });
  });

  shipCollectionsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/ship_collections', shipCollectionsRouter);
};
