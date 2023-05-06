const db = require("./db");
const helper = require("../helper");
const { query } = require("express");
const { extend, omit } = require("underscore");

async function checkEmployee(register, step) {
  const users = await db.query(
    `Select EmployeeId,FullName,Email,FatherName,MotherName,PermanentAddress,
      CommunicationAddress,DOB,EmergencyPhone,Phone,Qualifications,
      WorkLocation,staticstatus.StatusId,staticstatus.Status,Step from employees 
      join staticstatus on staticstatus.StatusId=employees.StatusId
      where Email='${register.Email}'`
  );
  var msg = "";
  var query = "";
  if (users.length == 0) {
    if (step == 0) {
      msg = {
        Message: "Continue",
      };
    }
  } else if (
    users.length != 0 &&
    users[0].StatusId == 5 &&
    users[0].Step == 0
  ) {
    msg = {
      Message: "Email Already Exits",
      Step: users[0].Step,
      StatusId: users[0].StatusId,
      data: users[0],
    };
  } else {
    msg = {
      Message: "Register User",
      Step: users[0].Step,
      data: users[0],
      StatusId: users[0].StatusId,
    };
  }
  if (query != "") {
    await db.query(query);
  }
  return msg;
}

async function submitEmployee(EmployeeId, step) {
  var query = "";

  var msg = "";

  if (EmployeeId > 0) {
    const document =
      await db.query(`select DocumentType from staticdocumenttypes where DocumentTypeId  NOT in 
    (select DocumentTypeId from employeedocuments where EmployeeId=${EmployeeId})
    and Mandatory= 'Yes'`);

    if (document.length == 0) {
      query = "update employees set";
      query += ` Step='${step}'`;
      query += ` where EmployeeId='${EmployeeId}'`;

      if (query != "") {
        await db.query(query);
        msg = {
          Status: "Success",
          Message:
            "Your Application has been submitted, You will receive an confirmation email with further details",
        };
      }
    } else {
      var documentList = document
        .map((item) => {
          return item.DocumentType;
        })
        .join("</br>");
      console.log(documentList);
      msg = {
        Status: "Error",
        Message: `Please upload mandatory document(s)!!!<b></br> ${documentList}</br></b> `,
      };
    }
  }

  return msg;
}

async function create(register, EmployeeId, CompanyId = 0) {
  var query = "";
  var msg = "";
  if (EmployeeId != 0) {
    query = `UPDATE employees set FullName='${register.FullName}', Email='${register.Email}', FatherName='${register.FatherName}',
     MotherName='${register.MotherName}', Password='${register.Password}', PermanentAddress='${register.PermanentAddress}',
     CommunicationAddress='${register.CommunicationAddress}', DOB='${register.DOB}', EmergencyPhone='${register.EmergencyPhone}',
     Phone='${register.Phone}', Qualifications='${register.Qualifications}',StatusId=5,WorkLocation='${register.WorkLocation}'
     where EmployeeId=${EmployeeId}`;
    msg = {
      Message: "Continue",
    };
  } else {
    query = db.generateDynamicSqlInsertQuery(
      extend(omit(register, ["ConfirmPassword"]), {
        Step: 0,
        StatusId: 5,
        CompanyId,
      }),
      "employees"
    );
  }

  if (query != "") {
    await db.query(query).catch((err) => {
      throw err;
    });
    msg = await checkEmployee(register, EmployeeId).catch((err) => {
      throw err;
    });
  }
  return msg;
}

const fetchMail = async () => {
  const rows = await db.query(`SELECT Email from employees `);
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
};

const fetch = async () => {
  const rows = await db.query(
    `SELECT * from employees where StatusId = 5 and Step =1`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
};

const fetchByStatus = async (id) => {
  const rows = await db.query(`SELECT * FROM employees where StatusId = ${id}`);
  return helper.emptyOrRows(rows);
};
const fetchById = async (id) => {
  const rows = await db.query(
    `SELECT * FROM employees where EmployeeId = ${id}`
  );
  return helper.emptyOrRows(rows);
};

const UpdateEmployeeStatus = async (employee) => {
  var query = "";
  if (employee.EmployeeId > 0) {
    query = "update employees set";
    query += ` StatusId='${employee.StatusId}'`;
    query += ` where EmployeeId='${employee.EmployeeId}'`;
  }
  await db.query(query);
};

const Upload = async (doc) => {
  query = `insert into employees(ProfileImage) values(doc.ProfileImage)`;
  console.log(query);
};

const FetchEmp = async () => {
  const rows = await db.query(
    `select * from employees ORDER BY EmployeeId DESC LIMIT 1`
  );
  return helper.emptyOrRows(rows);
};

module.exports = {
  checkEmployee,
  fetch,
  create,
  UpdateEmployeeStatus,
  fetchById,
  Upload,
  fetchMail,
  submitEmployee,
  fetchByStatus,
  FetchEmp,
};
