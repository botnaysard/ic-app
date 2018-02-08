const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use("/styles",express.static(__dirname + "/styles"));
app.use("/scripts",express.static(__dirname + "/scripts"));
app.use("/images",express.static(__dirname + "/images"));
app.use("/fonts",express.static(__dirname + "/fonts"));

MongoClient.connect('mongodb://ic-admin:&9D2JZkaD&ng@ds125588.mlab.com:25588/icdata', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/profile', (req, res) => {
  db.collection('profile').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})
