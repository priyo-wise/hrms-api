const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const DocumentType = require("../models/DocumentType");
const session = require("../service/session");

async function CreateEmployeeManager(
  ManagerId,
  EmployeeId,
  AssignedBy,
  Status
) {
  let message = "Error in Manager Mapping";
  var result2,
    resultReject = "";
  const rows = await db.query(
    `select * from employeedocuments where EmployeeId=${EmployeeId} and StatusId=5`
  );
  if (rows.length >= 1) {
    message = "Document Approval/Rejection is pending";
  } else if (
    (rows.length >= 1 && Status == 4) ||
    (rows.length == 0 && Status == 4)
  ) {
    result3 = await db.query(
      `UPDATE employees SET StatusId = 4 WHERE (EmployeeId = '${EmployeeId}')`
    );
    if (result3.affectedRows) {
      message = "Employee Rejected!!!";
    }
  } else {
    const result = await db.query(
      `INSERT INTO employeemanager (ManagerID, EmployeeId, AssignedBy)
     VALUES ('${ManagerId}','${EmployeeId}', '${AssignedBy}')`
    );

    if (result.affectedRows) {
      const empcode="Emp00"+ EmployeeId;
      console.log("empcode",empcode);
      result2 = await db.query(
        `UPDATE employees SET StatusId = 3 ,EmployeeCode='${empcode}' WHERE (EmployeeId = '${EmployeeId}')`
      );
    }
    if (result2.affectedRows) {
      message = "Employee Approved!!!";
    }
  }

  return { message };
}

const CreateEmployeeOfficelocation = async (location) => {
  var query = "";
  var msg = "";

  if (location.EmployeeId > 0) {
    query = "update employees set";
    query += ` OfficeLocationId='${location.OfficeLocationId}'`;
    query += ` where EmployeeId='${location.EmployeeId}'`;
  }
  await db.query(query);

  msg = "Office location Assigned Successfully !";

  return msg;
};

async function UpdateEmployeeDocument(DocumentId, Status, EmployeeId) {
  const result = await db.query(
    `UPDATE employeedocuments SET StatusId = '${Status}', ApprovedBy='${EmployeeId}', ApprovedOn =now()
    WHERE DocumentId = '${DocumentId}';`
  );
  let message = "Error in updating User Profile";

  if (result.affectedRows) {
    message = "User Profile updated successfully";
  }
}

async function FetchManagerByRole(roleId) {
  const rows = await db.query(
    `SELECT rls.RoleId,emp.EmployeeId,emp.FullName FROM userroles rls
join employees emp on emp.EmployeeId = rls.EmployeeId
where rls.roleId=${roleId}`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}
async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(`SELECT * FROM Employees`);
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}
async function Fetchlocation() {
  const rows = await db.query(`SELECT * FROM officelocation`);
  const data = helper.emptyOrRows(rows);

  return {
    data,
  };
}
async function getUserProfile(employeeId) {
  const rows = await db.query(
    `SELECT * FROM employees where EmployeeId=${employeeId}`
  );
  return helper.emptyOrRows(rows);
}
//`SELECT t1.*,t2.FullName,t3.RoleName from UserRoles t1 join Employees t2 on t1.EmployeeId=t2.EmployeeId join StaticRoles t3 on t1.RoleId=t3.RoleId`;

async function fetchByEmpId(employeeId) {
  const rows = await db.query(
    `SELECT t1.*,t2.DocumentType from employees t1 join t2 on t1.IdentityProof=t2.DocumentTypeId=16 where t1.EmployeeId = ${employeeId}`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

async function create(performance) {
  const result = await db.query(
    `INSERT INTO users ( EmployeeCode, Designation, FullName, Email, FatherName, MotherName, Password, PermanentAddress, CommunicationAddress, DOB, DOJ, EmergencyPhone, Phone, Qualifications, ProfileImage, IdentityProof, AddressProof, ReportingManagerId, Approved, UserStatus, IsManager, IsHR, TimeStamp, LastModified) VALUES ( '${performance.EmployeeCode}', '${performance.Designation}', 'Priya', '', '', '', '', '', '', '', '', '', '', '', '', '', '', NULL, '0', 'I', '0', '0', current_timestamp(), current_timestamp())`
  );

  let message = "Error in creating Performance";

  if (result.affectedRows) {
    message = "User created successfully";
  }

  return { message };
}

async function UpdateUserProfile(userProfile) {
  const result = await db.query(
    `UPDATE Employees SET Email = '${userProfile.Email}', FullName='${userProfile.FullName}',
    PermanentAddress = '${userProfile.PermanentAddress}', CommunicationAddress = '${userProfile.CommunicationAddress}', DOB = '${userProfile.DOB}', DOJ ='${userProfile.DOJ}', EmergencyPhone ='${userProfile.EmergencyPhone}', 
    Phone = '${userProfile.Phone}', Qualifications = '${userProfile.Qualifications}', Anniversary = '${userProfile.Anniversary}' WHERE EmployeeId = '${userProfile.EmployeeId}';`
  );
  let message = "Error in updating User Profile";

  if (result.affectedRows) {
    message = "User Profile updated successfully";
  }

  return { message };
}

async function FetchDocType(DocumentId) {
  const rows = await db.query(
    `SELECT t1.EmployeeId, t2.DocumentType,t3.Status from employeedocuments t1 join staticdocumenttypes t2 on t1.DocumentTypeId = t2.DocumentTypeId join staticstatus t3 on t1.StatusId=t3.StatusId WHERE DocumentId =${DocumentId}`
  );
  const data = helper.emptyOrRows(rows);
  return {
    data,
  };
}

module.exports = {
  getMultiple,
  create,
  getUserProfile,
  UpdateUserProfile,
  fetchByEmpId,
  FetchManagerByRole,
  UpdateEmployeeDocument,
  CreateEmployeeManager,
  Fetchlocation,
  CreateEmployeeOfficelocation,
  FetchDocType,
};
