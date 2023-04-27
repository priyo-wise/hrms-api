var db_gateway = require("./DAL/db_gateway.js");
var http_requests = require("./service/http_requests.js");
var users = require("./models/users.model.js");

const express = require("express");
const app = express();
const port = 8080;
var dg = new db_gateway();
const http = require("http");
const hostname = "127.0.0.1";

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/test", (req, res) => {
  var httpRequest = new http_requests(req);
  var user = new users(dg);
  resourceId = httpRequest.resourceId;
  res.send(user.getRecords(resourceId, callBack));
});

// const server = http.createServer((req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, PUT");
//   res.setHeader("Access-Control-Max-Age", 2592000);

//   var dg = new db_gateway();
//   var httpRequest = new http_requests(req);
//   var user = new users(dg);

//   var payload = "";

//   req.on("data", function (data) {
//     payload += data;
//   });

//   req.on("end", function () {
//     function callBack(err, result) {
//       res.statusCode = 200;

//       res.setHeader("Content-Type", "application/json");

//       var response = {};

//       if (err) {
//         response["error"] = err.message;
//       } else {
//         response["data"] = result;
//       }

//       res.write(JSON.stringify(response, null, 4));
//       res.end();
//     }

//     resourceId = httpRequest.resourceId;
//     console.log(req.method);

//     app.get("/test", (req, res) => {
//       res.send(user.getRecords(resourceId, callBack));
//     });

//     // switch (req.method) {
//     //   case "POST":
//     //     jsonData = JSON.parse(payload);
//     //     user.insertRecord(jsonData, callBack);

//     //     break;

//     //   case "PUT":
//     //     jsonData = JSON.parse(payload);

//     //     user.updateRecord(resourceId, jsonData, callBack);

//     //     break;

//     //   case "DELETE":
//     //     console.log("Delete Called", resourceId);
//     //     user.deleteRecord(resourceId, callBack);

//     //     break;

//     //   case "GET":
//     //     user.getRecords(resourceId, callBack);

//     //     break;
//     // }
//   });
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
