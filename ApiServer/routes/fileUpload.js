const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
var multer = require("multer");
let fs = require("fs-extra");
const app = express();
const bodyparser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const db = require("../models/db");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Body-parser middleware
const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    let type = req.query?.destination ?? "";
    let path = `${__dirname}/../uploads`;
    if (type != "") path += `/${type}`;
    fs.mkdirsSync(path);
    callback(null, path);
  },
  filename: (req, file, callback) => {
    callback(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage }).single();
router.post("/File", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        Error: "Error uploading file.",
      });
    }
    return res.status(200).send(req.file);
  });
});

// For Single image upload
router.post(
  "/uploadImage",
  imageUpload.single("image"),
  (req, res) => {
    // var query = `select * from employeedocuments where DocumentTypeId=${req.body.DocumentTypeId} and EmployeeId=${req.body.EmployeeId}`;
    // const result = db.query(query);
    // if (result.length != 0) {

    res.send(req.file);
    var imgsrc = req.file.filename;
    var insertData =
      "INSERT INTO employeedocuments(EmployeeId,Number,FilePath,DocumentTypeId)VALUES(?,?,?,?)";
    db.query(
      insertData,
      [req.body.EmployeeId, req.body.Number, imgsrc, req.body.DocumentTypeId],
      (err, result) => {
        if (err) throw err;
      }
    );
    // } else {
    //   res.status(200).send({ message: "Document already exist" });
    // }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// For Profile image upload
router.post(
  "/uploadProfile",
  imageUpload.single("image"),
  (req, res) => {
    res.send(req.file);
    var imgSrc = req.file.filename;
    var insertData = db.query(
      `Update Employees Set ProfileImage="${imgSrc}" where EmployeeId = ${req.body.EmployeeId}`
    );
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.post("/UploadProfileImage", async (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).send(req.file);
  });
});

// For Company Logo upload
router.post(
  "/uploadLogo",
  imageUpload.single("image"),
  (req, res) => {
    res.send(req.file);
    var imgSrc = req.file.filename;
    if (req.body.CompanyId == undefined) {
      var insertData =
        "INSERT INTO companyinformation(Logo,CompanyName)VALUES(?,?)";
      db.query(insertData, [imgSrc, "null"], (err, result) => {
        if (err) throw err;
      });
    } else {
      var insertData = db.query(
        `Update companyinformation Set Logo="${imgSrc}" where CompanyId = ${req.body.CompanyId}`
      );
    }
    // } else {
    //   res.status(200).send({ message: "Document already exist" });
    // }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
//File end

module.exports = router;
