const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyparser = require("body-parser");
const performanceRouter = require("./routes/performance");
const userRouter = require("./routes/User");
const applyleave = require("./routes/Applyleave");
const userProfileRouter = require("./routes/userProfile");
const authentication = require("./routes/authentication");
const fileUploadRouter = require("./routes/fileUpload");
const salaryPackage = require("./routes/SalaryPackage");
const CommonUtilityRoute = require("./routes/CommonUtilityRoute");
const dashboardRouter = require("./routes/Dashboard");
const LogIn = require("./routes/LogIn");
const LogOut = require("./routes/LogOut");
const Payslip = require("./routes/Payslip");
const JobFunction = require("./routes/JobFunction");
const DocumentType = require("./routes/DocumentType");
const LeaveType = require("./routes/LeaveType");
const Permission = require("./routes/Permission");
const StatusType = require("./routes/StatusType");
const Project = require("./routes/Project");
const leaveBalance = require("./routes/leaveBalance");
const MenuMaster = require("./routes/MenuMaster");
const RolePermission = require("./routes/RolePermission");
const MenuRole = require("./routes/MenuRole");
const TaxMaster = require("./routes/TaxMaster");
const SalaryTemplate = require("./routes/SalaryTemplate");
const SalaryComponent = require("./routes/SalaryComponents");
const FinanceTemplate = require("./routes/FinanceTemplate");
const EmployeeSalaryTemplate = require("./routes/EmployeeSalaryTemplate");
const PackageDetails = require("./routes/PackageDetails");
const CalculationMethod = require("./routes/CalculationMethod");
const SalaryTemplateComp = require("./routes/SalaryTemplateComp");
const Errorlog = require("./routes/Errorlog");
const StaticPage = require("./routes/StaticPage");
const StaticComponents = require("./routes/StaticComponents");
const ComponentDetails = require("./routes/ComponentDetails");
const Officelocation = require("./routes/Officelocation");
const FamilyDetails = require("./routes/FamilyDetails");
const Attendance = require("./routes/Attendance");
const Notification = require("./routes/Notification");
const ARTypeMaster = require("./routes/ARTypeMaster");
const SalaryARInvoice = require("./routes/SalaryARInvoice");

const EmployeeIdCard = require("./routes/EmployeeIdCard");

const CompanyProfile = require("./routes/CompanyProfile");
const { errorUserMessage } = require("./service/ErrorHandelingService");
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//session middleware
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + oneDay,
      maxAge: oneDay,
      httpOnly: true,
    },
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
app.use(bodyparser.json());

app.use((req, res, next) => {
  var send = res.json;
  res.json = function (body) {
    if ((body ?? null) != null) {
      if (res.statusCode == 400 && (body?.error ?? body?.Error ?? "") != "") {
        body = { Error: errorUserMessage(body?.error ?? body?.Error ?? "") };
      }
      //body = Buffer.from(JSON.stringify(body)).toString("base64");
    }
    send.call(this, body);
  };
  next();
});

app.use("/Performance", performanceRouter);
app.use("/Applyleave", applyleave);
// app.post("/add-employee", (request, response) => {
//   console.log("req", request.body, "Res", response);
// });
//app.use("/UserProfile", userProfileRouter);
app.use("/Dashboard", dashboardRouter);
app.use("/registration", require("./routes/registration"));
app.use("/auth", authentication);
app.use("/JobFunction", JobFunction);
app.use("/DocumentType", DocumentType);
//app.use("/KeyRating", KeyRating);
app.use("/Permission", Permission);
app.use("/LeaveType", LeaveType);
//app.use("/Roles", Roles);
app.use("/StatusType", StatusType);
//app.use("/Task", Task);
app.use("/Project", Project);
app.use("/TimeSheet", require("./routes/TimeSheet"));
app.use("/MenuMaster", MenuMaster);
//app.use("/UserRole", UserRole);
app.use("/RolePermission", RolePermission);
app.use("/LogIn", LogIn);
app.use("/auth", authentication);
app.use("/LogOut", LogOut);
app.use("/MenuRole", MenuRole);
app.use("/TaxMaster", TaxMaster);

// serve all static files inside public directory.
app.use("/images", express.static("uploads/images"));
//make uploads directory static
app.use(express.static("uploads"));

app.use("/Performance", performanceRouter);
app.use("/UserProfile", userProfileRouter);
app.use("/upload", fileUploadRouter);
app.use("/Payslip", Payslip);
app.use("/LeaveBalance", leaveBalance);
app.use("/User", userRouter);
//app.use("/Holiday", HolidayRouter);
app.use("/SalaryTemplate", SalaryTemplate);
app.use("/FinanceTemplate", FinanceTemplate);
app.use("/EmployeeSalaryTemplate", EmployeeSalaryTemplate);
app.use("/PackageDetails", PackageDetails);
app.use("/TaskType", require("./routes/TaskType"));
app.use("/SalaryComponent", SalaryComponent);
app.use("/CalculationMethod", CalculationMethod);
app.use("/SalaryTemplateComp", SalaryTemplateComp);
app.use("/EmployeePackage", salaryPackage);
app.use("/Errorlog", Errorlog);
app.use("/StaticPage", StaticPage);
app.use("/StaticComponents", StaticComponents);
app.use("/ComponentDetails", ComponentDetails);
app.use("/Officelocation", Officelocation);
app.use("/CompanyProfile", CompanyProfile);
app.use("/CommonUtility", CommonUtilityRoute);
app.use("/FamilyDetails", FamilyDetails);
app.use("/Attendance", Attendance);
app.use("/Notification", Notification);
app.use("/ARTypeMaster", ARTypeMaster);
app.use("/SalaryARInvoice", SalaryARInvoice);
app.use("/EmployeeIdCard", EmployeeIdCard);
// app.use("/ProjectRoleMaster", ProjectRoleMaster);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
