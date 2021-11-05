var express = require("express");
var app = express();
const port = process.env.PORT || 3003;
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

async function insertShippinginfo(request, response) {
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
