const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyparser = require("body-parser");
const performanceRouter = require("./routes/performance");

const applyleave = require("./routes/Applyleave");
const userProfileRouter = require("./routes/userProfile");
const authentication = require("./routes/authentication");
const fileUploadRouter = require("./routes/fileUpload");
const _ = require("lodash");

const dashboardRouter = require("./routes/Dashboard");
const LogIn = require("./routes/LogIn");

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

const app = express();
app.use(cors());

//session middleware
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.text());

app.use("/Performance", performanceRouter);
app.use("/Applyleave",applyleave);
// app.post("/add-employee", (request, response) => {
//   console.log("req", request.body, "Res", response);
// });
app.use("/UserProfile", userProfileRouter);
app.use("/Dashboard", dashboardRouter);
app.use("/LogIn", LogIn);
app.use("/auth", authentication);

// serve all static files inside public directory.
app.use("/images", express.static("uploads/images"));
//make uploads directory static
app.use(express.static("uploads"));

app.use("/Performance", performanceRouter);
app.use("/UserProfile", userProfileRouter);
app.use("/upload", fileUploadRouter);

const port = process.env.PORT || 3001;
app.listen(port,()=>console.log(`Listening on port ${port}...`));