var express = require("express");
var app = express();
const port = process.env.PORT || 3000;
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

client.connect();

async function insertShipping(request, response) {
  let shipping = request.body.shipping;
  client.query(
    "INSERT INTO shipping (address, city, id, name, shipping_method, shipping_method2, state, zipcode) values ($1, $2, $3, $4, $5, $6, $7, $8);",
    [
      shipping.address,
      shipping.city,
      shipping.id,
      shipping.name,
      shipping.shipping_method,
      shipping.shipping_method2,
      shipping.state,
      shipping.zipcode,
    ],
    (err, res) => {
      if (err) throw err;
      console.log(res);
      client.end();
    }
  );
}

app
  .route("/ShippingMicroservice/Shipping")
  .post(jsonParser, function (req, res) {
    console.log(req.body.product);
    insertShipping(req, res);
  });

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`Example app listening at ${host}:${port}`);
});
