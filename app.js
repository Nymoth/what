const express = require('express')
    , assert = require('assert')
    , bodyParser = require('body-parser')
    , app = express()
    , Datastore = require('nedb');

// app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));


// app.use('/assets', express.static('node_modules'));

const dbs = [
  'characters'
, 'houses'
];

dbs.forEach(dbname => {
  const db = new Datastore({ filename: `./data/${dbname}.json`, autoload: true });

  const url = `/${dbname}/`;
  const idUrl = `${url}:id`;
    
  app.get(url, (req, res) => {
    db.find({}).toArray((err, results) => {
      assert.equal(null, err);
      res.json({
        results
      });
    });
  });

  app.post(url, (req, res) => {
    const data = req.body;
    db.insertOne(data, (err, r) => {
      assert.equal(null, err);
      res.json(r);
    });
  });

  app.put(idUrl, (req, res) => {
    const _id = new mongodb.ObjectId(req.params.id)
        , data = req.body;

    db.findOneAndUpdate({ _id }, data, (err, r) => {
      assert.equal(null, err);
      res.json(r);
    });
  });

  app.delete(idUrl, (req, res) => {
    const _id = new mongodb.ObjectId(req.params.id);
    db.deleteOne({ _id }, (err, r) => {
      assert.equal(null, err);
      res.json({ _id });
    });
  });

  console.log('DB OK');
});

app.listen(3000);
console.log('Express server listening on port 3000');