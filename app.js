const express = require('express')
    , assert = require('assert')
    , bodyParser = require('body-parser')
    , app = express()
    , Datastore = require('nedb');

app.use(bodyParser.json());

const dbs = [
  'characters'
, 'houses'
];

dbs.forEach(dbname => {
  const db = new Datastore({ filename: `./data/${dbname}.json`, autoload: true });

  const url = `/${dbname}`;
  const idUrl = `${url}/:id`;
    
  app.get(url, (req, res) => {
    db.find({}, (err, results) => {
      assert.equal(null, err);
      res.json({
        results
      });
    });
  });

  app.get(idUrl, (req, res) => {
    const _id = +req.params.id
    db.findOne({ _id }, (err, results) => {
      assert.equal(null, err);
      res.json({
        results
      });
    });
  });

  app.post(url, (req, res) => {
    const data = req.body;

    db.find().sort({ _id: -1 }).limit(1).exec((err, r) => {
      assert.equal(null, err);

      const lastId = +r[0]._id;
      data._id = lastId + 1;

      db.insert(data, (err, ir) => {
        assert.equal(null, err);
        res.json(ir);
      });
    });

  });

  app.put(idUrl, (req, res) => {
    const _id = +req.params.id
        , data = req.body;

    db.update({ _id }, data, (err, r) => {
      assert.equal(null, err);
      res.json(r);
    });
  });

  app.delete(idUrl, (req, res) => {
    const _id = +req.params.id;
    db.remove({ _id }, (err, r) => {
      assert.equal(null, err);
      res.json({ _id });
    });
  });

  console.log(`DB ${dbname} OK`);
});

app.listen(3000);
console.log('Express server listening on port 3000');