const express = require("express");
const app = express();

app.post("/add-employee", (request, response) => {
  console.log("req", request.body, "Res", response);
});

app.get("/get-employee", (req, res) => {
  res.set("Content-Type", "text/html");
  res.status(200).send("<h1>Welcome to Wise</h1>");
});

module.exports = app;
