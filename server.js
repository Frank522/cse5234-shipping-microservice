var express = require("express");
var app = express();
const port = process.env.PORT || 3004;
const axios = require('axios');
const http = require("https");
const { Client } = require("pg");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  next();
});



async function insertShippinginfo(request, response) {
  client.connect();
  let shipping = request.body.shipping;
  client.query(
    "INSERT INTO shipping (id, shipping_method) values ($1, $2);",
    [
      shipping.id,
      shipping.shipping_method,
    ],
    (err, res) => {
      if (err) throw err;
      console.log(res);
      client.end();
    }
  );
  let result = {
    confirm: "SH015049",
    id: shipping.id,
    msg: "Garden Initiate the shipping process successfull"
  };
  response.send(result);
}

app
.route("/ShippingMicroservice/Shipping")
.post(
  jsonParser,
  function(req, res) {
    insertShippinginfo(req, res);
  }
)

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`Example app listening at ${host}:${port}`);
});
