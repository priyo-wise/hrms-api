-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 14, 2023 at 03:41 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employees`
--

-- --------------------------------------------------------

--
-- Table structure for table `ar_type_master`
--

CREATE TABLE `ar_type_master` (
  `ARTypeId` int(11) NOT NULL,
  `Code` varchar(50) NOT NULL,
  `DisplayDescription` varchar(100) DEFAULT NULL,
  `SalaryComponentId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companyinformation`
--

CREATE TABLE `companyinformation` (
  `CompanyId` int(11) NOT NULL,
    `Code` BINARY(16)  DEFAULT (UUID_TO_BIN(UUID())),
  `CompanyName` varchar(150) DEFAULT NULL,
  `Type` varchar(30) DEFAULT NULL,
  `Phone` varchar(30) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Fax` varchar(30) DEFAULT NULL,
  `State` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `pincode` varchar(50) DEFAULT NULL,
  `Address1` varchar(200) DEFAULT NULL,
  `Address2` varchar(200) DEFAULT NULL,
  `Address3` varchar(200) DEFAULT NULL,
  `Remarks` varchar(200) DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `TIN` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `PanNo` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Logo` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companyinformation`
--

INSERT INTO `companyinformation` (`CompanyId`, `CompanyName`, `Type`, `Phone`, `Email`, `Fax`, `State`, `city`, `pincode`, `Address1`, `Address2`, `Address3`, `Remarks`, `Status`, `TIN`, `PanNo`, `Logo`) VALUES
(1, 'Wise Software', 'Services', '8964284422', 'rahul@mail.com', '45698', 'BHOPAL', 'BHOPAL', '822114', 'BHOPAL', 'BHOPAL', '454', 'BHOPAL', 0, 'null', 'null', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `componentdetails`
--

CREATE TABLE `componentdetails` (
  `ComponentDetailsId` int(11) NOT NULL,
  `ComponentDetails` varchar(500) NOT NULL,
  `PageId` int(11) NOT NULL,
  `ComponentId` int(11) NOT NULL,
  `ComponentClass` varchar(100) NOT NULL,
  `Sequence` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeeactionnotification`
--

CREATE TABLE `employeeactionnotification` (
  `ActionNotificationId` int(11) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Subject` varchar(200) DEFAULT NULL,
  `Route` varchar(45) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `ReviewOn` datetime DEFAULT NULL,
  `Status` int(11) DEFAULT NULL,
  `EmployeeId` int(11) DEFAULT NULL,
  `RoleId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeeattendance`
--

CREATE TABLE `employeeattendance` (
  `AttendanceId` int(11) NOT NULL,
  `CheckInDate` datetime NOT NULL DEFAULT current_timestamp(),
  `CheckInTime` time DEFAULT NULL,
  `CheckOutTime` time DEFAULT NULL,
  `EmployeeId` int(11) NOT NULL,
  `Status` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeeattendance`
--

INSERT INTO `employeeattendance` (`AttendanceId`, `CheckInDate`, `CheckInTime`, `CheckOutTime`, `EmployeeId`, `Status`) VALUES
(4605, '2023-04-03', '20:06:30', '13:22:12', 3, 2),
(4606, '2023-04-03', '20:49:42', '10:50:08', 4, 2),
(4608, '2023-04-04', '10:50:05', '10:50:08', 4, 2),
(4626, '2023-04-04', '13:26:24', '13:26:33', 3, 2),
(4627, '2023-04-04', '13:26:43', '13:26:50', 3, 2),
(4628, '2023-04-04', '18:03:35', '18:03:38', 3, 2),
(4629, '2023-04-04', '18:03:40', '18:03:43', 3, 2),
(4630, '2023-04-05', '10:40:11', '10:40:14', 3, 2),
(4631, '2023-04-05', '10:40:15', NULL, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `employeedocuments`
--

CREATE TABLE `employeedocuments` (
  `DocumentId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `Number` varchar(50) DEFAULT NULL,
  `FilePath` varchar(100) DEFAULT NULL,
  `DocumentTypeId` int(4) DEFAULT NULL,
  `StatusId` int(11) DEFAULT 5,
  `ApprovedBy` int(11) DEFAULT NULL,
  `ApprovedOn` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeedocuments`
--

INSERT INTO `employeedocuments` (`DocumentId`, `EmployeeId`, `Number`, `FilePath`, `DocumentTypeId`, `StatusId`, `ApprovedBy`, `ApprovedOn`) VALUES
(1, 6, '123', 'image_1679376192589.png', 9, 4, 3, '2023-04-06 17:34:59'),
(2, 6, '1212', 'image_1679376203137.png', 10, 4, NULL, NULL),
(3, 0, '123', 'image_1679380312593.png', 9, 5, NULL, NULL),
(4, 0, '123', 'image_1679380323833.png', 10, 5, NULL, NULL),
(5, 7, '123', 'image_1679380480364.png', 9, 4, 3, '2023-04-06 14:59:18');

-- --------------------------------------------------------

--
-- Table structure for table `employeefamily`
--

CREATE TABLE `employeefamily` (
  `FamilyId` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Relation` varchar(100) NOT NULL,
  `Age` int(3) NOT NULL,
  `Gender` varchar(100) NOT NULL,
  `BloodGroup` varchar(50) NOT NULL,
  `EmployeeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeefamily`
--

INSERT INTO `employeefamily` (`FamilyId`, `Name`, `Relation`, `Age`, `Gender`, `BloodGroup`, `EmployeeId`) VALUES
(18, 'dipakf', 'f', 22, 'Other', 'B+', 3);

-- --------------------------------------------------------

--
-- Table structure for table `employeefinance`
--

CREATE TABLE `employeefinance` (
  `FinanceId` int(11) NOT NULL,
  `BankName` varchar(150) DEFAULT NULL,
  `BankAccountNo` int(25) DEFAULT NULL,
  `NameInAccount` varchar(50) DEFAULT NULL,
  `IFSCCode` varchar(20) DEFAULT NULL,
  `PFAccountNo` int(25) DEFAULT NULL,
  `PFUANNo` varchar(50) DEFAULT NULL,
  `EmployeeId` int(11) DEFAULT NULL,
  `StatusId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeejobfunction`
--

CREATE TABLE `employeejobfunction` (
  `EmployeeId` int(11) DEFAULT NULL,
  `JobFunctionId` int(11) DEFAULT NULL,
  `FromDate` date DEFAULT NULL,
  `ToDate` date DEFAULT NULL,
  `StatusId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeeleavebalances`
--

CREATE TABLE `employeeleavebalances` (
  `EmployeeId` int(11) DEFAULT NULL,
  `LeaveTypeId` int(11) DEFAULT NULL,
  `Balance` varchar(50) DEFAULT NULL,
  `leaveBalanceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeeleavebalances`
--

INSERT INTO `employeeleavebalances` (`EmployeeId`, `LeaveTypeId`, `Balance`, `leaveBalanceId`) VALUES
(1, 5, '0', 1),
(1, 6, '0', 2),
(4, 5, '0', 3),
(4, 6, '0', 4);

-- --------------------------------------------------------

--
-- Table structure for table `employeeleaves`
--

CREATE TABLE `employeeleaves` (
  `LeavesId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `LeaveApplyDate` date DEFAULT NULL,
  `LeaveFromDate` date DEFAULT NULL,
  `LeaveToDate` date DEFAULT NULL,
  `ApprovedBy` varchar(30) DEFAULT NULL,
  `LeaveTypeId` int(1) DEFAULT NULL,
  `ApprovalStatusId` int(11) DEFAULT NULL,
  `Remarks` varchar(300) DEFAULT NULL,
  `StatusId` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeeleaves`
--

INSERT INTO `employeeleaves` (`LeavesId`, `EmployeeId`, `LeaveApplyDate`, `LeaveFromDate`, `LeaveToDate`, `ApprovedBy`, `LeaveTypeId`, `ApprovalStatusId`, `Remarks`, `StatusId`) VALUES
(3, 3, '2023-03-21', '2023-03-22', '2023-03-23', NULL, 5, 5, 'Test Reason', 1);

-- --------------------------------------------------------

--
-- Table structure for table `employeeleavetransactions`
--

CREATE TABLE `employeeleavetransactions` (
  `leaveTransactionsId` int(11) NOT NULL,
  `leavetypeId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `ValidFormDate` date NOT NULL,
  `ValidToDate` date NOT NULL,
  `TransactionDate` date NOT NULL,
  `NoOfLeaveCredited` double NOT NULL,
  `NoOfLeaveDebited` double NOT NULL,
  `Notes` varchar(500) NOT NULL,
  `TransactionByUserId` int(11) NOT NULL,
  `TransactionsType` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeeleavetransactions`
--

INSERT INTO `employeeleavetransactions` (`leaveTransactionsId`, `leavetypeId`, `EmployeeId`, `ValidFormDate`, `ValidToDate`, `TransactionDate`, `NoOfLeaveCredited`, `NoOfLeaveDebited`, `Notes`, `TransactionByUserId`, `TransactionsType`) VALUES
(5, 5, 1, '2023-03-01', '0000-00-00', '2023-03-21', 0, 12, 'Casual Leave', 3, 'Dr'),
(6, 6, 1, '2023-03-01', '0000-00-00', '2023-03-21', 0, 6, 'Sick Leave', 3, 'Dr'),
(7, 5, 3, '0000-00-00', '0000-00-00', '2023-03-21', 0, 0, 'Test Reason', 3, 'Cr'),
(8, 5, 4, '2023-03-01', '0000-00-00', '2023-03-21', 0, 12, 'Casual Leave for Neha', 3, 'Dr'),
(9, 6, 4, '2024-03-05', '0000-00-00', '2023-04-04', 0, 2, 'Sick Leave for Neha', 3, 'Dr');

-- --------------------------------------------------------

--
-- Table structure for table `employeemanager`
--

CREATE TABLE `employeemanager` (
  `EmployeeManagerId` int(11) NOT NULL,
  `ManagerID` int(11) DEFAULT NULL,
  `EmployeeId` int(11) DEFAULT NULL,
  `ValidFrom` datetime DEFAULT current_timestamp(),
  `ValidUpto` datetime DEFAULT NULL,
  `AssignedBy` int(11) DEFAULT NULL,
  `AssignedOn` datetime DEFAULT current_timestamp(),
  `Status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeepackagedetails`
--

CREATE TABLE `employeepackagedetails` (
  `EmployeePackageId` int(11) NOT NULL,
  `SalaryComponentId` int(11) NOT NULL,
  `Amount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeepackages`
--

CREATE TABLE `employeepackages` (
  `EmployeePackageId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `FromDate` datetime NOT NULL,
  `ToDate` datetime DEFAULT NULL,
  `SalaryTemplateId` int(11) DEFAULT NULL,
  `SalaryPaymentFrequency` varchar(50) DEFAULT NULL,
  `CTC` decimal(18,2) DEFAULT NULL,
  `TotalEarning` decimal(18,2) DEFAULT NULL,
  `TotalDeduction` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeepackages`
--

INSERT INTO `employeepackages` (`EmployeePackageId`, `EmployeeId`, `FromDate`, `ToDate`, `SalaryTemplateId`, `SalaryPaymentFrequency`, `CTC`, `TotalEarning`, `TotalDeduction`) VALUES
(3, 1, '2023-03-23 18:30:00', '2023-04-04 18:29:59', 8, 'Monthly', '120000.00', '10000.00', '200.00');

-- --------------------------------------------------------

--
-- Table structure for table `employeepayslip`
--

CREATE TABLE `employeepayslip` (
  `PayslipId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `TotalWorkingDays` int(11) NOT NULL,
  `UnpaidAbsenceDays` int(11) NOT NULL,
  `FromDate` datetime DEFAULT NULL,
  `ToDate` datetime DEFAULT NULL,
  `GrossSalary` text DEFAULT NULL,
  `TotalDeductions` text DEFAULT NULL,
  `NetSalary` text DEFAULT NULL,
  `IncludeKRAScoreInPayslip` text DEFAULT NULL,
  `StatusId` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeepayslip`
--

INSERT INTO `employeepayslip` (`PayslipId`, `EmployeeId`, `TotalWorkingDays`, `UnpaidAbsenceDays`, `FromDate`, `ToDate`, `GrossSalary`, `TotalDeductions`, `NetSalary`, `IncludeKRAScoreInPayslip`, `StatusId`) VALUES
(11, 1, 8, 0, '2023-03-23 18:30:00', '2023-03-30 18:30:00', '2580.64', '100', '2480.64', '4', 7);

-- --------------------------------------------------------

--
-- Table structure for table `employeepayslipcomponents`
--

CREATE TABLE `employeepayslipcomponents` (
  `PayslipId` int(11) NOT NULL,
  `SalaryComponentId` int(11) NOT NULL,
  `CalculatedAmount` decimal(18,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeepayslipcomponents`
--

INSERT INTO `employeepayslipcomponents` (`PayslipId`, `SalaryComponentId`, `CalculatedAmount`) VALUES
(11, 1, '1548.39'),
(11, 2, '464.52'),
(11, 3, '100.00'),
(11, 8, '258.06'),
(11, 9, '219.35'),
(11, 10, '38.71'),
(11, 11, '0.00'),
(11, 12, '51.61'),
(11, 13, '0.00');

-- --------------------------------------------------------

--
-- Table structure for table `employeepayslipdeductions`
--

CREATE TABLE `employeepayslipdeductions` (
  `PayslipId` int(11) NOT NULL,
  `DeductionTaxId` int(11) NOT NULL,
  `DeductionName` varchar(30) NOT NULL,
  `DeductionAmt` decimal(11,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeepayslippayments`
--

CREATE TABLE `employeepayslippayments` (
  `EmployeePayslipPaymentId` int(11) NOT NULL,
  `PayslipId` int(11) NOT NULL,
  `PaymentDate` datetime NOT NULL,
  `PaymentTrasactionNo` varchar(50) NOT NULL,
  `PaymentMethod` varchar(25) NOT NULL,
  `PaidAmount` decimal(18,2) NOT NULL DEFAULT 0.00,
  `StatusId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeepayslippayments`
--

INSERT INTO `employeepayslippayments` (`EmployeePayslipPaymentId`, `PayslipId`, `PaymentDate`, `PaymentTrasactionNo`, `PaymentMethod`, `PaidAmount`, `StatusId`) VALUES
(3, 11, '2023-04-06 18:30:00', '789789', 'NEFT', '1000.00', NULL),
(4, 11, '2023-04-19 18:30:00', '7897', 'Cash', '1480.64', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employeeperformance`
--

CREATE TABLE `employeeperformance` (
  `PerformanceId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `FromDate` datetime DEFAULT NULL,
  `ToDate` datetime DEFAULT NULL,
  `ManagerScore` int(1) DEFAULT NULL,
  `EmpSelfScore` int(1) DEFAULT NULL,
  `FinalAgreedScore` int(1) DEFAULT NULL,
  `FinalReviewComments` varchar(500) DEFAULT NULL,
  `HRComments` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeeperformance`
--

INSERT INTO `employeeperformance` (`PerformanceId`, `EmployeeId`, `FromDate`, `ToDate`, `ManagerScore`, `EmpSelfScore`, `FinalAgreedScore`, `FinalReviewComments`, `HRComments`) VALUES
(16, 1, '2023-02-28 18:30:00', '2023-03-30 18:30:00', 5, 5, 5, 'Final Review Comment', 'HR Comments');

-- --------------------------------------------------------

--
-- Table structure for table `employeeperformancedetails`
--

CREATE TABLE `employeeperformancedetails` (
  `PerformanceId` int(11) DEFAULT NULL,
  `StandardKRAId` int(11) DEFAULT NULL,
  `EmpSpecificKRAId` int(11) DEFAULT NULL,
  `EmployeeSelfAssessment` varchar(300) DEFAULT NULL,
  `ManagerAssessment` varchar(300) DEFAULT NULL,
  `PerformanceDetailsId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `EmployeeId` int(11) NOT NULL,
  `EmployeeCode` varchar(30) DEFAULT NULL,
  `Department` varchar(30) DEFAULT NULL,
  `Designation` varchar(30) DEFAULT NULL,
  `FullName` varchar(30) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `FatherName` varchar(30) DEFAULT NULL,
  `MotherName` varchar(30) DEFAULT NULL,
  `Password` varchar(20) DEFAULT NULL,
  `PermanentAddress` varchar(200) DEFAULT NULL,
  `CommunicationAddress` varchar(200) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `DOJ` date DEFAULT NULL,
  `EmergencyPhone` varchar(20) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Qualifications` varchar(100) DEFAULT NULL,
  `WorkLocation` varchar(100) DEFAULT NULL,
  `ProfileImage` varchar(150) DEFAULT NULL,
  `IdentityProof` varchar(150) DEFAULT NULL,
  `AddressProof` varchar(150) DEFAULT NULL,
  `Anniversary` date DEFAULT NULL,
  `PANNo` varchar(30) DEFAULT NULL,
  `StatusId` int(11) DEFAULT NULL,
  `TimeStamp` datetime DEFAULT current_timestamp(),
  `LastModified` datetime DEFAULT NULL,
  `Step` int(11) DEFAULT NULL,
  `HrComment` varchar(500) DEFAULT NULL,
  `OfficeLocationId` int(11) DEFAULT NULL,
  `IsIdCardActive` varchar(20) DEFAULT NULL,
  `ExpireDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`EmployeeId`, `EmployeeCode`, `Department`, `Designation`, `FullName`, `Email`, `FatherName`, `MotherName`, `Password`, `PermanentAddress`, `CommunicationAddress`, `DOB`, `DOJ`, `EmergencyPhone`, `Phone`, `Qualifications`, `WorkLocation`, `ProfileImage`, `IdentityProof`, `AddressProof`, `Anniversary`, `PANNo`, `StatusId`, `TimeStamp`, `LastModified`, `Step`, `HrComment`, `OfficeLocationId`) VALUES
(1, 'Emp002', NULL, 'Employee', 'Amit', 'employee@mail.com', NULL, NULL, '1234', '', '', '2023-04-14', '0000-00-00', '', '', '', NULL, 'image_1680674403051.jpg', NULL, NULL, '2023-04-20', NULL, 3, NULL, NULL, NULL, NULL, NULL),
(3, 'Emp001', NULL, 'Admin', 'Ankur Maheshwari', 'admin@mail.com', NULL, NULL, '1234', 'd', 'd', '1110-12-31', '0000-00-00', '5464644654', '7987979897', 'MCA', NULL, 'image_1680675017936.jpg', NULL, NULL, '0000-00-00', NULL, 3, NULL, NULL, NULL, NULL, NULL),
(4, 'Emp003', NULL, 'HR', 'Neha', 'hr@mail.com', NULL, NULL, '1234', '', '', '0000-00-00', '0000-00-00', '', '', '', NULL, 'image_1680673739124.jpg', NULL, NULL, '0000-00-00', NULL, 3, NULL, NULL, NULL, NULL, NULL),
(5, 'Emp004', NULL, 'Manager', 'Rupesh', 'manager@mail.com', NULL, NULL, '1234', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL),
(6, NULL, NULL, 'Employee', 'Priyabrata Maiti', 'priyo.asn@gmail.com', 'Fathers Name', 'Mothers Name', '12345678', 'Permanent Address', 'Communication Address', '1986-10-08', '0000-00-00', '9800150003', '9800150003', 'MCA', 'Work From Home', NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, 1, NULL, NULL),
(7, NULL, NULL, NULL, 'Animesh', 'Animesh@gmail.com', 'werewr', 'werewr', '12345678', 'Test', 'Test', '1986-10-08', '0000-00-00', '1234567890', '1234567890', 'MCA', 'Work From Home', NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employeesalary`
--

CREATE TABLE `employeesalary` (
  `Basic` decimal(11,3) DEFAULT NULL,
  `DearnessAllowance` decimal(11,3) DEFAULT NULL,
  `HRA` decimal(11,3) DEFAULT NULL,
  `MedicalAllowance` decimal(11,3) DEFAULT NULL,
  `PerformanceBonus` decimal(11,3) DEFAULT NULL,
  `Bonus` decimal(11,3) DEFAULT NULL,
  `SpecialAllowance` decimal(11,3) DEFAULT NULL,
  `Conveyance` decimal(11,3) DEFAULT NULL,
  `LTA` decimal(11,3) DEFAULT NULL,
  `FromDate` date DEFAULT NULL,
  `ToDate` date DEFAULT NULL,
  `StatusId` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeesalarytemplate`
--

CREATE TABLE `employeesalarytemplate` (
  `SalaryTemplateId` int(11) NOT NULL,
  `EmployeeId` int(11) DEFAULT NULL,
  `FromDate` date DEFAULT NULL,
  `ToDate` date DEFAULT NULL,
  `StatusId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employeetaxesapplicable`
--

CREATE TABLE `employeetaxesapplicable` (
  `EmployeeId` int(11) DEFAULT NULL,
  `TaxId` int(11) DEFAULT NULL,
  `StatusId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_ar_invoice_adjusment`
--

CREATE TABLE `employee_ar_invoice_adjusment` (
  `ARInvoiceId` int(11) NOT NULL,
  `PayslipId` int(11) NOT NULL,
  `Amount` decimal(18,2) NOT NULL DEFAULT 0.00,
  `TransactionDate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_salary_ar_invoice`
--

CREATE TABLE `employee_salary_ar_invoice` (
  `ARInvoiceId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `ARTypeId` int(11) NOT NULL,
  `TransactionNo` varchar(100) NOT NULL,
  `TransactionDate` datetime NOT NULL DEFAULT current_timestamp(),
  `TransactionMode` varchar(50) NOT NULL,
  `Amount` decimal(18,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `errorlogs`
--

CREATE TABLE `errorlogs` (
  `ErrorlogId` int(11) NOT NULL,
  `ErrorNumber` int(11) NOT NULL,
  `ErrorDetailLog` varchar(500) NOT NULL,
  `ErrorDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `errortable`
--

CREATE TABLE `errortable` (
  `ErrorId` int(11) NOT NULL,
  `ErrorNumber` int(11) NOT NULL,
  `ErrorCode` varchar(100) NOT NULL,
  `ErrorDescription` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `holidaymaster`
--

CREATE TABLE `holidaymaster` (
  `HolidayId` int(11) NOT NULL,
  `HolidayWeekDay` varchar(20) NOT NULL,
  `HolidayDate` date NOT NULL,
  `HolidayName` varchar(100) NOT NULL,
  `HolidaySaka` varchar(50) DEFAULT NULL,
  `HolidayComments` varchar(200) DEFAULT NULL,
  `CreatedBy` int(11) NOT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `CommentsStatus` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `holidaymaster`
--

INSERT INTO `holidaymaster` (`HolidayId`, `HolidayWeekDay`, `HolidayDate`, `HolidayName`, `HolidaySaka`, `HolidayComments`, `CreatedBy`, `CreatedAt`, `CommentsStatus`) VALUES
(1, 'Sunday', '2023-01-01', 'New Year', NULL, 'New Year is the time or day at which a new calendar year begins', 1, '2023-03-14', 6),
(2, 'Thursday', '2023-01-26', 'Republic Day/ Vasanth Panchami', 'माघ 06', 'Republic Day is the day when India marks and celebrates the date on which the Constitution of India', 1, '2023-03-14', 6),
(3, 'Saturday', '2023-02-18', 'Maha Shivratri', NULL, 'According to the Hindu Calender, the festival is observed on the fourteenth day of the dark (waning)', 1, '2023-03-14', 6),
(4, 'Wednesday', '2023-03-08', 'Holi', 'फाल्गुण 17', 'Holi is a popular and significant Hindu festival celebrated as the Festival of Colours, Love and Spring.', 1, '2023-03-14', 6),
(5, 'Thursday', '2023-03-30', 'Ram Navmi', '	चैत्र 09', 'Rama Navami is a Hindu festival that celebrates the birthday of Rama, the seventh avatar of the deity Vishnu', 1, '2023-03-14', 0),
(6, 'Tuesday', '2023-04-04', 'Mahavir Jayanti', 'चैत्र 17', 'Mahavir Janma Kalyanak is one of the most important religious festivals in Jainism. It celebrates the birth of Mahavir, the twenty-fourth and last Tirthankara of present Avasarpiṇī.', 1, '2023-03-14', 3);

-- --------------------------------------------------------

--
-- Table structure for table `menurole`
--

CREATE TABLE `menurole` (
  `MenuRoleId` int(11) NOT NULL,
  `MenuId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menurole`
--

INSERT INTO `menurole` (`MenuRoleId`, `MenuId`, `RoleId`) VALUES
(1, 2, 7),
(2, 3, 7),
(3, 5, 7),
(4, 7, 1),
(5, 7, 7),
(6, 8, 7),
(7, 9, 7),
(8, 11, 1),
(9, 11, 2),
(10, 11, 7),
(11, 12, 7),
(12, 13, 7),
(13, 14, 7),
(14, 22, 7),
(15, 23, 7),
(16, 31, 7),
(17, 32, 7),
(20, 40, 1),
(21, 40, 7),
(22, 41, 1),
(23, 41, 7),
(24, 44, 1),
(25, 44, 7),
(26, 45, 1),
(27, 45, 7),
(28, 63, 7),
(29, 69, 7),
(30, 70, 7),
(31, 71, 7),
(32, 73, 7),
(33, 76, 7),
(34, 2, 2),
(35, 3, 2),
(37, 77, 7),
(38, 2, 3),
(39, 3, 3),
(40, 70, 1),
(41, 69, 1),
(42, 73, 1),
(43, 73, 3),
(44, 73, 2),
(45, 79, 7),
(46, 69, 7),
(47, 71, 1),
(48, 85, 7),
(49, 63, 1),
(50, 85, 1),
(51, 70, 3),
(55, 80, 7),
(56, 87, 7),
(57, 5, 3),
(58, 88, 7),
(59, 89, 7),
(60, 90, 7),
(61, 78, 7),
(62, 78, 1),
(63, 91, 1),
(64, 91, 7);

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `MenuId` int(11) NOT NULL,
  `MenuText` varchar(100) DEFAULT NULL,
  `ParentId` int(11) DEFAULT NULL,
  `Route` varchar(100) DEFAULT NULL,
  `Icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`MenuId`, `MenuText`, `ParentId`, `Route`, `Icon`) VALUES
(1, 'Time Sheet', NULL, NULL, 'fa fa-calendar'),
(2, 'Time Sheet Entry', 1, 'TimeSheet/Entry', 'fa fa-calendar-plus-o'),
(3, 'Time Sheet Report', 1, 'TimeSheet/Report', 'fa fa-calendar-check-o'),
(5, 'Performance', 86, 'Performance', 'fa fa-line-chart'),
(6, 'Master', NULL, NULL, 'fa fa-handshake-o'),
(7, 'Role', 6, 'Roles', 'fa fa-users'),
(8, 'Permission', 6, 'Permission', 'fa fa-get-pocket'),
(9, 'Menu', 6, 'MenuMaster', 'fa fa-bars'),
(10, 'Mapping', NULL, NULL, 'fa fa-plus-square'),
(11, 'User Role', 10, 'UserRole', 'fa fa-user'),
(12, 'Project', 1, 'Project', 'fa fa-product-hunt'),
(13, 'Task', 1, 'Task', 'fa fa-tasks'),
(14, 'Menu Role', 10, 'MenuRole', 'fa fa-th-large'),
(22, 'Role Permission', 10, 'RolePermission', 'fa fa-lock'),
(23, 'Task Type', 1, 'TaskType', 'fa fa-thumb-tack'),
(31, 'Holiday', 6, 'Holiday', 'fa fa-h-square'),
(32, 'Status', 6, 'Status', 'fa fa-certificate'),
(40, 'Key Rating', 6, 'KeyRating', 'fa fa-star-half-o'),
(41, 'Leave Type', 6, 'LeaveType', 'fa fa-square-o'),
(44, 'Job Function', 6, 'JobFunction', 'fa fa-filter'),
(45, 'Document', 6, 'Document', 'fa fa-file'),
(63, 'Registration Approval', 86, 'RegistrationApproval', 'fa fa-thumbs-up'),
(69, 'Leave Allocation', 85, 'leaveBalance', 'fa fa-balance-scale'),
(70, 'Apply Leaves', 85, 'AllApplyleavelist', 'fa fa-bar-chart'),
(71, 'Template', 83, 'Template', 'fa fa-cubes'),
(73, 'Payslip', 83, 'Payslip', 'fa fa-credit-card'),
(74, 'Payslip Template', 83, 'PayslipTemplate', 'fa fa-file-code-o'),
(76, 'Employee Salary Package', 83, 'SalaryPackage', 'fa fa-dollar'),
(77, 'Salary Component', 83, 'SalaryComponent', 'fa fa-dollar'),
(78, 'Office location', 6, 'officelocation', NULL),
(79, 'Team', 1, 'TimeSheet/Team', NULL),
(80, 'Attendance Report', 84, 'AttendanceReport', 'fa fa-lock'),
(83, 'Salary PaySlip', NULL, NULL, 'fa fa-money'),
(84, 'Report', NULL, NULL, 'fa fa-bar-chart'),
(85, 'Leave', NULL, NULL, 'fa fa-users'),
(86, 'Employee', NULL, NULL, 'fa fa-users'),
(87, 'Bank Details', 6, 'BankDetails', 'fa fa-bank'),
(88, 'AR Type', 6, 'ARTypeMaster', NULL),
(89, 'Salary Invoice', 6, 'SalaryARInvoice', NULL),
(90, 'Make Employee ID Card', 6, 'EmployeeIdCard', NULL),
(91, 'Project Role', 1, 'ProjectRoleMaster', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `officelocation`
--

CREATE TABLE `officelocation` (
  `OfficeLocationId` int(11) NOT NULL,
  `CompanyId` int(11) NOT NULL,
  `Location` varchar(500) NOT NULL,
  `Address` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `officelocation`
--

INSERT INTO `officelocation` (`OfficeLocationId`, `CompanyId`, `Location`, `Address`) VALUES
(1, 1, 'Indore', 'Vijay Nagar'),
(2, 1, 'Jaipur', 'Veshali Nagar');

-- --------------------------------------------------------

--
-- Table structure for table `otheremployeesspecifickra`
--

CREATE TABLE `otheremployeesspecifickra` (
  `EmpSpecificKRAId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `KRA` varchar(300) DEFAULT NULL,
  `KRADescription` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otheremployeesspecifickra`
--

INSERT INTO `otheremployeesspecifickra` (`EmpSpecificKRAId`, `EmployeeId`, `KRA`, `KRADescription`) VALUES
(1, 1, 'Special Note', 'Special Descrription'),
(3, 3, 'Test2', 'Test2 Description');

-- --------------------------------------------------------

--
-- Table structure for table `projectmaster`
--

CREATE TABLE `projectmaster` (
  `ProjectId` int(11) NOT NULL,
  `ProjectName` varchar(500) NOT NULL,
  `BudgetTotalHour` decimal(18,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projectmaster`
--

INSERT INTO `projectmaster` (`ProjectId`, `ProjectName`, `BudgetTotalHour`) VALUES
(1, 'Libro CDO', '100.00'),
(2, 'UCU CDI', '0.00'),
(3, 'Meridian CDO', '170.00'),
(4, 'Employee Management', '120.00');

-- --------------------------------------------------------

--
-- Table structure for table `project_budget`
--

CREATE TABLE `project_budget` (
  `ProjectId` int(11) NOT NULL,
  `TaskTypeId` int(11) NOT NULL,
  `Hours` decimal(18,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_budget`
--

INSERT INTO `project_budget` (`ProjectId`, `TaskTypeId`, `Hours`) VALUES
(1, 1, '80.00'),
(1, 2, '20.00');

-- --------------------------------------------------------

--
-- Table structure for table `project_team`
--

CREATE TABLE `project_team` (
  `ProjectId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL,
  `CreatedDate` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_team`
--

INSERT INTO `project_team` (`ProjectId`, `EmployeeId`, `CreatedDate`) VALUES
(1, 1, '2023-04-03 21:02:46'),
(1, 3, '2023-04-03 21:02:47'),
(1, 4, '2023-04-03 21:02:48');

-- --------------------------------------------------------

--
-- Table structure for table `rolepermissions`
--

CREATE TABLE `rolepermissions` (
  `RolePermissionId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `PermissionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rolepermissions`
--

INSERT INTO `rolepermissions` (`RolePermissionId`, `RoleId`, `PermissionId`) VALUES
(46, 1, 30),
(47, 1, 31),
(49, 1, 32),
(50, 1, 33),
(51, 1, 34),
(52, 1, 35),
(53, 1, 36),
(54, 1, 37),
(55, 1, 38),
(56, 1, 39),
(57, 1, 41),
(58, 1, 42),
(59, 1, 43),
(60, 1, 44),
(48, 1, 45),
(62, 1, 46),
(64, 1, 47),
(108, 1, 52),
(110, 1, 55),
(72, 1, 57),
(74, 1, 58),
(76, 1, 59),
(77, 1, 60),
(78, 1, 61),
(73, 1, 62),
(75, 1, 63),
(123, 1, 74),
(116, 1, 81),
(91, 2, 69),
(96, 2, 84),
(99, 3, 7),
(100, 3, 8),
(101, 3, 9),
(102, 3, 11),
(103, 3, 16),
(119, 3, 52),
(2, 7, 1),
(3, 7, 7),
(4, 7, 8),
(5, 7, 9),
(6, 7, 10),
(7, 7, 11),
(8, 7, 12),
(9, 7, 13),
(10, 7, 14),
(11, 7, 15),
(12, 7, 16),
(14, 7, 17),
(30, 7, 18),
(32, 7, 19),
(31, 7, 20),
(38, 7, 21),
(40, 7, 22),
(39, 7, 23),
(27, 7, 24),
(29, 7, 25),
(28, 7, 26),
(33, 7, 27),
(35, 7, 28),
(34, 7, 29),
(36, 7, 30),
(37, 7, 31),
(21, 7, 32),
(23, 7, 33),
(22, 7, 34),
(24, 7, 35),
(26, 7, 36),
(25, 7, 37),
(18, 7, 38),
(20, 7, 39),
(19, 7, 41),
(15, 7, 42),
(17, 7, 43),
(16, 7, 44),
(61, 7, 46),
(63, 7, 47),
(65, 7, 48),
(66, 7, 49),
(67, 7, 50),
(68, 7, 51),
(109, 7, 52),
(111, 7, 55),
(113, 7, 56),
(79, 7, 57),
(81, 7, 58),
(83, 7, 59),
(84, 7, 60),
(85, 7, 61),
(80, 7, 62),
(82, 7, 63),
(86, 7, 65),
(87, 7, 66),
(88, 7, 67),
(89, 7, 68),
(90, 7, 69),
(104, 7, 70),
(105, 7, 71),
(107, 7, 72),
(114, 7, 74),
(120, 7, 77),
(115, 7, 80),
(95, 7, 81),
(97, 7, 82),
(92, 7, 83),
(98, 7, 88);

-- --------------------------------------------------------

--
-- Table structure for table `salarytemplatecomponents`
--

CREATE TABLE `salarytemplatecomponents` (
  `TemplateComponentId` int(11) NOT NULL,
  `TemplateId` int(11) NOT NULL,
  `SalaryComponentId` int(11) NOT NULL,
  `DependentOnComponentId` int(11) DEFAULT NULL,
  `IsDependentOnCTC` tinyint(4) DEFAULT NULL,
  `CalculationMethodId` int(11) DEFAULT NULL,
  `NumberOrAmount` decimal(16,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salarytemplatecomponents`
--

INSERT INTO `salarytemplatecomponents` (`TemplateComponentId`, `TemplateId`, `SalaryComponentId`, `DependentOnComponentId`, `IsDependentOnCTC`, `CalculationMethodId`, `NumberOrAmount`) VALUES
(10, 8, 1, NULL, 1, 1, '3.33'),
(11, 8, 2, 10, NULL, 1, '30.00'),
(12, 8, 12, NULL, NULL, 2, '200.00'),
(16, 8, 8, NULL, NULL, 2, '1000.00'),
(17, 8, 9, NULL, NULL, NULL, NULL),
(19, 8, 3, NULL, NULL, 2, '200.00'),
(20, 8, 11, NULL, NULL, NULL, NULL),
(21, 8, 13, NULL, NULL, NULL, NULL),
(22, 8, 10, NULL, NULL, 2, '150.00'),
(23, 9, 1, 10, 0, 1, '20.00'),
(24, 9, 2, 10, NULL, 1, '5.00'),
(25, 9, 12, 11, NULL, 2, '20000.00'),
(26, 9, 8, NULL, NULL, 2, '1500.00'),
(27, 9, 9, NULL, NULL, 1, '10.00'),
(28, 9, 3, NULL, NULL, 1, '10.00'),
(29, 9, 11, NULL, NULL, 2, '4000.00'),
(30, 9, 10, NULL, NULL, 2, '1000.00');

-- --------------------------------------------------------

--
-- Table structure for table `salarytemplates`
--

CREATE TABLE `salarytemplates` (
  `TemplateId` int(11) NOT NULL,
  `TemplateName` varchar(50) NOT NULL,
  `Description` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salarytemplates`
--

INSERT INTO `salarytemplates` (`TemplateId`, `TemplateName`, `Description`) VALUES
(8, 'Interns', NULL),
(9, 'Developer', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `standardkraforjobfunction`
--

CREATE TABLE `standardkraforjobfunction` (
  `StandardKRAId` int(11) NOT NULL,
  `JobFunctionId` int(11) NOT NULL,
  `KRAId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `standardkraforjobfunction`
--

INSERT INTO `standardkraforjobfunction` (`StandardKRAId`, `JobFunctionId`, `KRAId`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `staticcalculationmethods`
--

CREATE TABLE `staticcalculationmethods` (
  `CalculationMethodId` int(11) NOT NULL,
  `Code` varchar(100) NOT NULL,
  `CalculationMethod` varchar(500) DEFAULT NULL,
  `Status` int(11) NOT NULL,
  `CreatedBy` int(11) DEFAULT NULL,
  `CreatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staticcalculationmethods`
--

INSERT INTO `staticcalculationmethods` (`CalculationMethodId`, `Code`, `CalculationMethod`, `Status`, `CreatedBy`, `CreatedAt`) VALUES
(1, 'Percentage', '%', 1, NULL, NULL),
(2, 'Fixed', 'Fixed', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staticcomponents`
--

CREATE TABLE `staticcomponents` (
  `ComponentId` int(11) NOT NULL,
  `ComponentName` varchar(100) NOT NULL,
  `ComponentDescription` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staticdocumenttypes`
--

CREATE TABLE `staticdocumenttypes` (
  `DocumentTypeId` int(11) NOT NULL,
  `DocumentType` varchar(100) DEFAULT NULL,
  `Status` varchar(30) DEFAULT NULL,
  `Mandatory` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staticdocumenttypes`
--

INSERT INTO `staticdocumenttypes` (`DocumentTypeId`, `DocumentType`, `Status`, `Mandatory`) VALUES
(9, 'PAN Card', 'Active', 'Yes'),
(17, 'Aadhar Card', 'Active', 'Yes');

-- --------------------------------------------------------

--
-- Table structure for table `staticjobfunctions`
--

CREATE TABLE `staticjobfunctions` (
  `JobFunctionId` int(11) NOT NULL,
  `JobFunction` varchar(100) NOT NULL,
  `JobDescription` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staticjobfunctions`
--

INSERT INTO `staticjobfunctions` (`JobFunctionId`, `JobFunction`, `JobDescription`) VALUES
(1, 'Developer', 'Development');

-- --------------------------------------------------------

--
-- Table structure for table `statickra`
--

CREATE TABLE `statickra` (
  `KRAId` int(11) NOT NULL,
  `KRAShortDescription` varchar(300) DEFAULT NULL,
  `KRADescription` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `statickra`
--

INSERT INTO `statickra` (`KRAId`, `KRAShortDescription`, `KRADescription`) VALUES
(1, 'Train Interns', 'You are supposed to train interns and juniors on the latest technologies '),
(2, 'Test', 'Test description'),
(4, 'Train Interns', '1. You are supposed to train interns and juniors on the latest technologies\r\n2. You are supposed to give guidance and support \r\n3. You will help them to understand the latest tools and technologies'),
(5, 'Test1', 'Test1 Description');

-- --------------------------------------------------------

--
-- Table structure for table `staticleavetypes`
--

CREATE TABLE `staticleavetypes` (
  `LeaveId` int(11) NOT NULL,
  `LeaveName` varchar(30) DEFAULT NULL,
  `LeaveDescription` varchar(300) DEFAULT NULL,
  `StatusId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staticleavetypes`
--

INSERT INTO `staticleavetypes` (`LeaveId`, `LeaveName`, `LeaveDescription`, `StatusId`) VALUES
(5, 'Casual', 'Casual', NULL),
(6, 'Sick', 'Sick Leave', NULL),
(7, 'Paid Leave', 'Paid Leave', NULL),
(8, 'Unpaid Leave', 'Unpaid Leave', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staticpages`
--

CREATE TABLE `staticpages` (
  `PageId` int(11) NOT NULL,
  `PageName` varchar(100) NOT NULL,
  `MenuId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staticpermissions`
--

CREATE TABLE `staticpermissions` (
  `PermissionId` int(11) NOT NULL,
  `Permission` varchar(50) DEFAULT NULL,
  `PermissionDescription` varchar(300) DEFAULT NULL,
  `Code` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staticpermissions`
--

INSERT INTO `staticpermissions` (`PermissionId`, `Permission`, `PermissionDescription`, `Code`) VALUES
(1, 'TimeSheet Report - Search All Users', NULL, 'SAU'),
(7, 'Performance - Add', NULL, 'PA'),
(8, 'Performance - Edit', NULL, 'PE'),
(9, 'Performance - Modify Date', NULL, 'PMD'),
(10, 'Performance - Select User', NULL, 'PSU'),
(11, 'Performance - Employee Rating', NULL, 'PER'),
(12, 'Performance - Manager Rating', NULL, 'PMR'),
(13, 'Performance - Final Rating', NULL, 'PFR'),
(14, 'Performance - Final Review Comment', NULL, 'PFRC'),
(15, 'Performance - HR Comment', NULL, 'PHRC'),
(16, 'Performance - Employee Self Assessment', NULL, 'PESA'),
(17, 'Performance - Manager Assessment', NULL, 'PMA'),
(18, 'Roles - Add', 'Roles - Add', 'RA'),
(19, 'Roles - Edit', 'Roles - Edit', 'RE'),
(20, 'Roles - Delete', 'Roles - Delete', 'RD'),
(21, 'Permission - Add', 'Permission - Add', 'UPA'),
(22, 'Permission - Edit', 'Permission - Edit', 'UPE'),
(23, 'Permission - Delete', 'Permission - Delete', 'UPD'),
(24, 'Menu - Add', 'Menu - Add', 'MA'),
(25, 'Menu - Edit', 'Menu - Edit', 'ME'),
(26, 'Menu - Delete', 'Menu - Delete', 'MD'),
(27, 'Status - Add', 'Status - Add', 'SA'),
(28, 'Status - Edit', 'Status - Edit', 'SE'),
(29, 'Status - Delete', 'Status - Delete', 'SD'),
(30, 'Tax - Add', 'Tax - Add', 'TA'),
(31, 'Tax - Edit', 'Tax - Edit', 'TE'),
(32, 'Key Rating - Add', 'Key Rating - Add', 'KRA'),
(33, 'Key Rating - Edit', 'Key Rating - Edit', 'KRE'),
(34, 'Key Rating - Delete', 'Key Rating - Delete', 'KRD'),
(35, 'Leave Type - Add', 'Leave Type - Add', 'LTA'),
(36, 'Leave Type - Edit', 'Leave Type - Edit', 'LTE'),
(37, 'Leave Type - Delete', 'Leave Type - Delete', 'LTD'),
(38, 'Job Function - Add', 'Job Function - Add', 'JFA'),
(39, 'Job Function - Edit', 'Job Function - Edit', 'JFE'),
(41, 'Job Function - Delete', 'Job Function - Delete', 'JFD'),
(42, 'Document - Add', 'Document - Add', 'DA'),
(43, 'Document - Edit', 'Document - Edit', 'DE'),
(44, 'Document - Delete', 'Document - Delete', 'DD'),
(45, 'Tax - Delete', 'Tax - Delete', 'TD'),
(46, 'User Role - Add', 'User Role - Add', 'URA'),
(47, 'User Role - Delete', 'User Role - Delete', 'URD'),
(48, 'Menu Role - Add', 'Menu Role - Add', 'MRA'),
(49, 'Menu Role - Delete', 'Menu Role - Delete', 'MRD'),
(50, 'Role Permission - Add', 'Role Permission - Add', 'RPA'),
(51, 'Role Permission - Delete', 'Role Permission - Delete', 'RPD'),
(52, 'Leave - Add', 'Leave Add', 'LA'),
(53, 'Leave - Edit', 'Leave Edit', 'LE'),
(54, 'Leave - Cancel', 'Leave Cancel', 'LC'),
(55, 'Leave - Approve Reject', 'Leave  Approve Reject', 'LAR'),
(56, 'Leave - Search All User', 'Leave Search All User', 'LSAU'),
(57, 'PaySlip - Add', NULL, 'PSA'),
(58, 'PaySlip - Delete', NULL, 'PSD'),
(59, 'PaySlip - Edit', NULL, 'PSE'),
(60, 'PaySlip - Publish', NULL, 'PSP'),
(61, 'PaySlip - Search AllUser', NULL, 'PSSAU'),
(62, 'PaySlip - Add Payment', NULL, 'PSAP'),
(63, 'PaySlip - Delete Payment', NULL, 'PSDP'),
(64, 'Salary Package - Add', NULL, 'SPA'),
(65, 'Salary Package - Edit', NULL, 'SPE'),
(66, 'Salary Package - Search All User', NULL, 'SPSAU'),
(67, 'User Profile - Edit', NULL, 'UPFLE'),
(68, 'User Profile - Search All Users', NULL, 'UPLFSAU'),
(69, 'User Profile - View', NULL, 'UPFLV'),
(70, 'Holiday - Add', NULL, 'HA'),
(71, 'Holiday - Edit', NULL, 'HE'),
(72, 'Holiday - Delete', NULL, 'HD'),
(73, 'Change Password - Edit', NULL, 'CPE'),
(74, 'Leave - Allocation', 'leave Allocation', 'LAC'),
(75, 'Registration - Approval', 'Registration Approval', 'RAPVL'),
(76, 'Salary - Template Add', 'Salary Template Add', 'STA'),
(77, 'Salary - Template Edit', 'Salary Template Edit', 'STE'),
(78, 'Salary - Component Add', 'Salary Component Add', 'SCA'),
(79, 'Salary - Component Edit', 'Salary Component Edit', 'SCE'),
(80, 'Project - Add', NULL, 'PRA'),
(81, 'Project - Edit', NULL, 'PRE'),
(82, 'Project - Delete', NULL, 'PRD'),
(83, 'Project - AssignTeam', NULL, 'PEAT'),
(84, 'TimeSheet Report - Reporting User', 'Under Manager', 'TSRRU'),
(85, 'Office Location - Add', NULL, 'OLA'),
(86, 'Office Location - Edit', NULL, 'OLE'),
(87, 'Office Location - Delete', NULL, 'OLD'),
(88, 'Attendance Report - Search All Users', NULL, 'ARSAU');

-- --------------------------------------------------------

--
-- Table structure for table `staticroles`
--

CREATE TABLE `staticroles` (
  `RoleId` int(11) NOT NULL,
  `RoleName` varchar(30) DEFAULT NULL,
  `StatusId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staticroles`
--

INSERT INTO `staticroles` (`RoleId`, `RoleName`, `StatusId`) VALUES
(1, 'HR', NULL),
(2, 'Manager', NULL),
(3, 'Employee', NULL),
(7, 'Admin', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staticsalarycomponents`
--

CREATE TABLE `staticsalarycomponents` (
  `SalaryComponentsId` int(11) NOT NULL,
  `EarningOrDeductionName` varchar(100) NOT NULL,
  `EarningOrDeductionType` varchar(100) DEFAULT NULL,
  `PreTaxORPostTax` varchar(50) DEFAULT NULL,
  `Status` int(11) NOT NULL,
  `CreatedBy` int(11) DEFAULT NULL,
  `CreatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staticsalarycomponents`
--

INSERT INTO `staticsalarycomponents` (`SalaryComponentsId`, `EarningOrDeductionName`, `EarningOrDeductionType`, `PreTaxORPostTax`, `Status`, `CreatedBy`, `CreatedAt`) VALUES
(1, 'Basic', 'Earning', NULL, 1, 1, '0000-00-00 00:00:00'),
(2, 'HRA', 'Earning', NULL, 1, 1, '0000-00-00 00:00:00'),
(3, 'Professional Tax', 'Deduction', 'Pre Tax', 3, 3, '2023-03-20 00:48:27'),
(8, 'Medical Allowance', 'Earning', NULL, 0, 3, '2023-03-20 16:39:41'),
(9, 'Performance Bonus', 'Earning', NULL, 0, 3, '2023-03-20 16:40:09'),
(10, 'Telephone Allowance', 'Earning', NULL, 0, 3, '2023-03-20 16:40:52'),
(11, 'Referral Bonus', 'Earning', NULL, 0, 3, '2023-03-20 16:42:07'),
(12, 'LTA', 'Earning', NULL, 0, 3, '2023-03-20 16:42:22'),
(13, 'TDS', 'Deduction', 'Post Tax', 0, 3, '2023-03-20 16:42:41');

-- --------------------------------------------------------

--
-- Table structure for table `staticstatus`
--

CREATE TABLE `staticstatus` (
  `StatusId` int(11) NOT NULL,
  `Status` varchar(30) DEFAULT NULL,
  `StatusMeaning` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staticstatus`
--

INSERT INTO `staticstatus` (`StatusId`, `Status`, `StatusMeaning`) VALUES
(1, 'Applied', 'Applied'),
(2, 'Cancel', 'Cancel'),
(3, 'Approved', 'Approved'),
(4, 'Reject', 'Reject'),
(5, 'Pending', 'Pending'),
(7, 'Published', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `taskcategorymaster`
--

CREATE TABLE `taskcategorymaster` (
  `TaskCategoryId` int(11) NOT NULL,
  `TaskTypeId` int(11) DEFAULT NULL,
  `TaskCategoryName` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `taskcategorymaster`
--

INSERT INTO `taskcategorymaster` (`TaskCategoryId`, `TaskTypeId`, `TaskCategoryName`) VALUES
(1, 2, 'Meeting'),
(2, 1, 'Development'),
(5, 1, 'Deployment');

-- --------------------------------------------------------

--
-- Table structure for table `tasktype`
--

CREATE TABLE `tasktype` (
  `TaskTypeId` int(11) NOT NULL,
  `CoreCode` varchar(50) NOT NULL,
  `DisplayDescription` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasktype`
--

INSERT INTO `tasktype` (`TaskTypeId`, `CoreCode`, `DisplayDescription`) VALUES
(1, 'Billable', 'Billable'),
(2, 'NonBillable', 'Non-Billable');

-- --------------------------------------------------------

--
-- Table structure for table `taxesmaster`
--

CREATE TABLE `taxesmaster` (
  `TaxId` int(11) NOT NULL,
  `PaySlipTextForTax` varchar(200) DEFAULT NULL,
  `TaxDescription` varchar(500) DEFAULT NULL,
  `PercentageOrFixed` varchar(4) DEFAULT NULL,
  `NumberOrAmount` decimal(11,3) DEFAULT NULL,
  `FrequencyMonthlyYearly` varchar(50) DEFAULT NULL,
  `DeductionType` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timesheet`
--

CREATE TABLE `timesheet` (
  `TimeSheetId` int(11) NOT NULL,
  `Date` date DEFAULT NULL,
  `TimeInHour` double DEFAULT NULL,
  `ProjectId` int(11) DEFAULT NULL,
  `TaskCategoryId` int(11) DEFAULT NULL,
  `EmployeeId` int(11) DEFAULT NULL,
  `Details` text DEFAULT NULL,
  `UpdatedTime` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `UpdatedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timesheet`
--

INSERT INTO `timesheet` (`TimeSheetId`, `Date`, `TimeInHour`, `ProjectId`, `TaskCategoryId`, `EmployeeId`, `Details`, `UpdatedTime`, `UpdatedBy`) VALUES
(4, '2023-03-10', 8, 3, 2, 3, 'Fix: Application Sorting Movement', '2023-03-11 20:10:21', 3),
(6, '2023-03-21', 5, 1, 1, 1, 'Test 1', '2023-03-21 11:04:21', 1),
(7, '2023-03-21', 1.22, 1, 1, 1, 'Test 2', '2023-03-21 11:04:31', 1),
(8, '2023-03-22', 2, 2, 1, 1, 'Test 3', '2023-03-21 11:04:42', 1),
(9, '2023-03-22', 1.3, 1, 1, 1, 'Test 4', '2023-03-21 11:04:58', 1),
(10, '2023-03-21', 1.5, 1, 1, 5, 'Test Manager 1', '2023-03-21 11:05:48', 5),
(11, '2023-03-21', 1, 1, 1, 5, 'Test Manager 2', '2023-03-21 11:05:55', 5),
(12, '2023-03-22', 3, 2, 1, 5, 'Test Manager 3', '2023-03-21 11:06:04', 5),
(13, '2023-03-22', 4, 2, 2, 5, 'Test Manager 4', '2023-03-21 11:06:11', 5);

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE `userroles` (
  `UserRoleId` int(11) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `EmployeeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`UserRoleId`, `RoleId`, `EmployeeId`) VALUES
(1, 1, 4),
(2, 2, 5),
(3, 3, 1),
(4, 7, 3);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_template_component`
-- (See below for the actual view)
--
CREATE TABLE `view_template_component` (
`TemplateComponentId` int(11)
,`TemplateId` int(11)
,`SalaryComponentId` int(11)
,`DependentOnComponentId` int(11)
,`IsDependentOnCTC` tinyint(4)
,`CalculationMethodId` int(11)
,`NumberOrAmount` decimal(16,2)
,`Code` varchar(100)
,`CalculationMethod` varchar(500)
,`EarningOrDeductionName` varchar(100)
,`EarningOrDeductionType` varchar(100)
,`PreTaxORPostTax` varchar(50)
);

-- --------------------------------------------------------

--
-- Structure for view `view_template_component`
--
-- DROP TABLE IF EXISTS `view_template_component`;

-- CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_template_component`  AS SELECT `t1`.`TemplateComponentId` AS `TemplateComponentId`, `t1`.`TemplateId` AS `TemplateId`, `t1`.`SalaryComponentId` AS `SalaryComponentId`, `t1`.`DependentOnComponentId` AS `DependentOnComponentId`, `t1`.`IsDependentOnCTC` AS `IsDependentOnCTC`, `t1`.`CalculationMethodId` AS `CalculationMethodId`, `t1`.`NumberOrAmount` AS `NumberOrAmount`, `t2`.`Code` AS `Code`, `t2`.`CalculationMethod` AS `CalculationMethod`, `t3`.`EarningOrDeductionName` AS `EarningOrDeductionName`, `t3`.`EarningOrDeductionType` AS `EarningOrDeductionType`, `t3`.`PreTaxORPostTax` AS `PreTaxORPostTax` FROM ((`salarytemplatecomponents` `t1` left join `staticcalculationmethods` `t2` on(`t1`.`CalculationMethodId` = `t2`.`CalculationMethodId`)) join `staticsalarycomponents` `t3` on(`t3`.`SalaryComponentsId` = `t1`.`SalaryComponentId`))  ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ar_type_master`
--
ALTER TABLE `ar_type_master`
  ADD PRIMARY KEY (`ARTypeId`),
  ADD UNIQUE KEY `Code` (`Code`),
  ADD UNIQUE KEY `SalaryComponentId` (`SalaryComponentId`);

--
-- Indexes for table `companyinformation`
--
ALTER TABLE `companyinformation`
  ADD PRIMARY KEY (`CompanyId`);

--
-- Indexes for table `componentdetails`
--
ALTER TABLE `componentdetails`
  ADD PRIMARY KEY (`ComponentDetailsId`),
  ADD KEY `PageId` (`PageId`),
  ADD KEY `ComponentId` (`ComponentId`);

--
-- Indexes for table `employeeactionnotification`
--
ALTER TABLE `employeeactionnotification`
  ADD PRIMARY KEY (`ActionNotificationId`),
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `RoleId` (`RoleId`);

--
-- Indexes for table `employeeattendance`
--
ALTER TABLE `employeeattendance`
  ADD PRIMARY KEY (`AttendanceId`),
  ADD KEY `EmployeeId` (`EmployeeId`);

--
-- Indexes for table `employeedocuments`
--
ALTER TABLE `employeedocuments`
  ADD PRIMARY KEY (`DocumentId`),
  ADD KEY `FK_StatusStatusId` (`StatusId`),
  ADD KEY `FK_EmployeesEmployeeId` (`EmployeeId`),
  ADD KEY `FK_DocumentTypeId` (`DocumentTypeId`);

--
-- Indexes for table `employeefamily`
--
ALTER TABLE `employeefamily`
  ADD PRIMARY KEY (`FamilyId`),
  ADD KEY `EmployeeId` (`EmployeeId`);

--
-- Indexes for table `employeefinance`
--
ALTER TABLE `employeefinance`
  ADD PRIMARY KEY (`FinanceId`),
  ADD KEY `FK_EmployeeId` (`EmployeeId`),
  ADD KEY `FK_StatusId` (`StatusId`);

--
-- Indexes for table `employeejobfunction`
--
ALTER TABLE `employeejobfunction`
  ADD KEY `FK_EmployeeJobFunctionId` (`JobFunctionId`),
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `employeeleavebalances`
--
ALTER TABLE `employeeleavebalances`
  ADD PRIMARY KEY (`leaveBalanceId`),
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `LeaveTypeId` (`LeaveTypeId`);

--
-- Indexes for table `employeeleaves`
--
ALTER TABLE `employeeleaves`
  ADD PRIMARY KEY (`LeavesId`),
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `LeaveTypeId` (`LeaveTypeId`),
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `employeeleavetransactions`
--
ALTER TABLE `employeeleavetransactions`
  ADD PRIMARY KEY (`leaveTransactionsId`),
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `leavetypeId` (`leavetypeId`);

--
-- Indexes for table `employeemanager`
--
ALTER TABLE `employeemanager`
  ADD PRIMARY KEY (`EmployeeManagerId`);

--
-- Indexes for table `employeepackagedetails`
--
ALTER TABLE `employeepackagedetails`
  ADD PRIMARY KEY (`EmployeePackageId`,`SalaryComponentId`),
  ADD KEY `SalaryComponentId` (`SalaryComponentId`),
  ADD KEY `EmployeePackageId` (`EmployeePackageId`);

--
-- Indexes for table `employeepackages`
--
ALTER TABLE `employeepackages`
  ADD PRIMARY KEY (`EmployeePackageId`),
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `SalaryTemplateId` (`SalaryTemplateId`);

--
-- Indexes for table `employeepayslip`
--
ALTER TABLE `employeepayslip`
  ADD PRIMARY KEY (`PayslipId`),
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `employeepayslipcomponents`
--
ALTER TABLE `employeepayslipcomponents`
  ADD PRIMARY KEY (`PayslipId`,`SalaryComponentId`),
  ADD KEY `SalaryComponentId` (`SalaryComponentId`);

--
-- Indexes for table `employeepayslipdeductions`
--
ALTER TABLE `employeepayslipdeductions`
  ADD KEY `PayslipId` (`PayslipId`);

--
-- Indexes for table `employeepayslippayments`
--
ALTER TABLE `employeepayslippayments`
  ADD PRIMARY KEY (`EmployeePayslipPaymentId`),
  ADD UNIQUE KEY `PaymentTrasactionNo` (`PaymentTrasactionNo`),
  ADD KEY `PayslipId` (`PayslipId`),
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `employeeperformance`
--
ALTER TABLE `employeeperformance`
  ADD PRIMARY KEY (`PerformanceId`),
  ADD KEY `EmployeeId` (`EmployeeId`);

--
-- Indexes for table `employeeperformancedetails`
--
ALTER TABLE `employeeperformancedetails`
  ADD PRIMARY KEY (`PerformanceDetailsId`),
  ADD KEY `PerformanceId` (`PerformanceId`),
  ADD KEY `StandardKRAId` (`StandardKRAId`),
  ADD KEY `EmpSpecificKRAId` (`EmpSpecificKRAId`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`EmployeeId`);

--
-- Indexes for table `employeesalary`
--
ALTER TABLE `employeesalary`
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `employeesalarytemplate`
--
ALTER TABLE `employeesalarytemplate`
  ADD PRIMARY KEY (`SalaryTemplateId`),
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `employeetaxesapplicable`
--
ALTER TABLE `employeetaxesapplicable`
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `TaxId` (`TaxId`),
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `employee_ar_invoice_adjusment`
--
ALTER TABLE `employee_ar_invoice_adjusment`
  ADD PRIMARY KEY (`ARInvoiceId`,`PayslipId`),
  ADD KEY `PayslipId` (`PayslipId`);

--
-- Indexes for table `employee_salary_ar_invoice`
--
ALTER TABLE `employee_salary_ar_invoice`
  ADD PRIMARY KEY (`ARInvoiceId`),
  ADD UNIQUE KEY `TransactionNo` (`TransactionNo`),
  ADD KEY `ARTypeId` (`ARTypeId`),
  ADD KEY `EmployeeId` (`EmployeeId`);

--
-- Indexes for table `errorlogs`
--
ALTER TABLE `errorlogs`
  ADD PRIMARY KEY (`ErrorlogId`);

--
-- Indexes for table `errortable`
--
ALTER TABLE `errortable`
  ADD PRIMARY KEY (`ErrorId`);

--
-- Indexes for table `holidaymaster`
--
ALTER TABLE `holidaymaster`
  ADD PRIMARY KEY (`HolidayId`);

--
-- Indexes for table `menurole`
--
ALTER TABLE `menurole`
  ADD PRIMARY KEY (`MenuRoleId`),
  ADD KEY `menurole_ibfk_1` (`MenuId`),
  ADD KEY `menurole_ibfk_2` (`RoleId`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`MenuId`),
  ADD UNIQUE KEY `Route` (`Route`),
  ADD KEY `ParentId` (`ParentId`);

--
-- Indexes for table `officelocation`
--
ALTER TABLE `officelocation`
  ADD PRIMARY KEY (`OfficeLocationId`);

--
-- Indexes for table `otheremployeesspecifickra`
--
ALTER TABLE `otheremployeesspecifickra`
  ADD PRIMARY KEY (`EmpSpecificKRAId`),
  ADD KEY `EmployeeId` (`EmployeeId`);

--
-- Indexes for table `projectmaster`
--
ALTER TABLE `projectmaster`
  ADD PRIMARY KEY (`ProjectId`),
  ADD UNIQUE KEY `ProjectName` (`ProjectName`);

--
-- Indexes for table `project_budget`
--
ALTER TABLE `project_budget`
  ADD PRIMARY KEY (`ProjectId`,`TaskTypeId`),
  ADD KEY `TaskTypeId` (`TaskTypeId`);

--
-- Indexes for table `project_team`
--
ALTER TABLE `project_team`
  ADD PRIMARY KEY (`ProjectId`,`EmployeeId`),
  ADD KEY `EmployeeId` (`EmployeeId`);

--
-- Indexes for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  ADD PRIMARY KEY (`RolePermissionId`),
  ADD UNIQUE KEY `RoleId_2` (`RoleId`,`PermissionId`),
  ADD KEY `RoleId` (`RoleId`),
  ADD KEY `PermissionId` (`PermissionId`);

--
-- Indexes for table `salarytemplatecomponents`
--
ALTER TABLE `salarytemplatecomponents`
  ADD PRIMARY KEY (`TemplateComponentId`),
  ADD UNIQUE KEY `TemplateId_2` (`TemplateId`,`SalaryComponentId`),
  ADD KEY `CalculationMethodId` (`CalculationMethodId`),
  ADD KEY `SalaryComponentId` (`SalaryComponentId`),
  ADD KEY `TemplateId` (`TemplateId`),
  ADD KEY `DependentOnComponentId` (`DependentOnComponentId`);

--
-- Indexes for table `salarytemplates`
--
ALTER TABLE `salarytemplates`
  ADD PRIMARY KEY (`TemplateId`);

--
-- Indexes for table `standardkraforjobfunction`
--
ALTER TABLE `standardkraforjobfunction`
  ADD PRIMARY KEY (`StandardKRAId`),
  ADD KEY `KRAId` (`KRAId`);

--
-- Indexes for table `staticcalculationmethods`
--
ALTER TABLE `staticcalculationmethods`
  ADD PRIMARY KEY (`CalculationMethodId`);

--
-- Indexes for table `staticcomponents`
--
ALTER TABLE `staticcomponents`
  ADD PRIMARY KEY (`ComponentId`);

--
-- Indexes for table `staticdocumenttypes`
--
ALTER TABLE `staticdocumenttypes`
  ADD PRIMARY KEY (`DocumentTypeId`);

--
-- Indexes for table `staticjobfunctions`
--
ALTER TABLE `staticjobfunctions`
  ADD PRIMARY KEY (`JobFunctionId`);

--
-- Indexes for table `statickra`
--
ALTER TABLE `statickra`
  ADD PRIMARY KEY (`KRAId`);

--
-- Indexes for table `staticleavetypes`
--
ALTER TABLE `staticleavetypes`
  ADD PRIMARY KEY (`LeaveId`),
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `staticpages`
--
ALTER TABLE `staticpages`
  ADD PRIMARY KEY (`PageId`),
  ADD KEY `MenuId` (`MenuId`);

--
-- Indexes for table `staticpermissions`
--
ALTER TABLE `staticpermissions`
  ADD PRIMARY KEY (`PermissionId`),
  ADD UNIQUE KEY `Code` (`Code`),
  ADD UNIQUE KEY `Permission` (`Permission`);

--
-- Indexes for table `staticroles`
--
ALTER TABLE `staticroles`
  ADD PRIMARY KEY (`RoleId`),
  ADD KEY `StatusId` (`StatusId`);

--
-- Indexes for table `staticsalarycomponents`
--
ALTER TABLE `staticsalarycomponents`
  ADD PRIMARY KEY (`SalaryComponentsId`),
  ADD UNIQUE KEY `EarningOrDeductionName` (`EarningOrDeductionName`);

--
-- Indexes for table `staticstatus`
--
ALTER TABLE `staticstatus`
  ADD PRIMARY KEY (`StatusId`);

--
-- Indexes for table `taskcategorymaster`
--
ALTER TABLE `taskcategorymaster`
  ADD PRIMARY KEY (`TaskCategoryId`),
  ADD KEY `TaskTypeId` (`TaskTypeId`);

--
-- Indexes for table `tasktype`
--
ALTER TABLE `tasktype`
  ADD PRIMARY KEY (`TaskTypeId`),
  ADD UNIQUE KEY `CoreCode` (`CoreCode`);

--
-- Indexes for table `taxesmaster`
--
ALTER TABLE `taxesmaster`
  ADD PRIMARY KEY (`TaxId`);

--
-- Indexes for table `timesheet`
--
ALTER TABLE `timesheet`
  ADD PRIMARY KEY (`TimeSheetId`),
  ADD KEY `EmployeeId` (`EmployeeId`),
  ADD KEY `ProjectId` (`ProjectId`),
  ADD KEY `TaskCategoryId` (`TaskCategoryId`),
  ADD KEY `UpdatedBy` (`UpdatedBy`);

--
-- Indexes for table `userroles`
--
ALTER TABLE `userroles`
  ADD PRIMARY KEY (`UserRoleId`),
  ADD KEY `userroles_ibfk_1` (`EmployeeId`),
  ADD KEY `userroles_ibfk_2` (`RoleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ar_type_master`
--
ALTER TABLE `ar_type_master`
  MODIFY `ARTypeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `companyinformation`
--
ALTER TABLE `companyinformation`
  MODIFY `CompanyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `componentdetails`
--
ALTER TABLE `componentdetails`
  MODIFY `ComponentDetailsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `employeeactionnotification`
--
ALTER TABLE `employeeactionnotification`
  MODIFY `ActionNotificationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `employeeattendance`
--
ALTER TABLE `employeeattendance`
  MODIFY `AttendanceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4632;

--
-- AUTO_INCREMENT for table `employeedocuments`
--
ALTER TABLE `employeedocuments`
  MODIFY `DocumentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `employeefamily`
--
ALTER TABLE `employeefamily`
  MODIFY `FamilyId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `employeefinance`
--
ALTER TABLE `employeefinance`
  MODIFY `FinanceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `employeeleavebalances`
--
ALTER TABLE `employeeleavebalances`
  MODIFY `leaveBalanceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employeeleaves`
--
ALTER TABLE `employeeleaves`
  MODIFY `LeavesId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `employeeleavetransactions`
--
ALTER TABLE `employeeleavetransactions`
  MODIFY `leaveTransactionsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `employeemanager`
--
ALTER TABLE `employeemanager`
  MODIFY `EmployeeManagerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employeepackages`
--
ALTER TABLE `employeepackages`
  MODIFY `EmployeePackageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employeepayslip`
--
ALTER TABLE `employeepayslip`
  MODIFY `PayslipId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `employeepayslippayments`
--
ALTER TABLE `employeepayslippayments`
  MODIFY `EmployeePayslipPaymentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employeeperformance`
--
ALTER TABLE `employeeperformance`
  MODIFY `PerformanceId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `employeeperformancedetails`
--
ALTER TABLE `employeeperformancedetails`
  MODIFY `PerformanceDetailsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `EmployeeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `employeesalarytemplate`
--
ALTER TABLE `employeesalarytemplate`
  MODIFY `SalaryTemplateId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_salary_ar_invoice`
--
ALTER TABLE `employee_salary_ar_invoice`
  MODIFY `ARInvoiceId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `errorlogs`
--
ALTER TABLE `errorlogs`
  MODIFY `ErrorlogId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `errortable`
--
ALTER TABLE `errortable`
  MODIFY `ErrorId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `holidaymaster`
--
ALTER TABLE `holidaymaster`
  MODIFY `HolidayId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `menurole`
--
ALTER TABLE `menurole`
  MODIFY `MenuRoleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `MenuId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `officelocation`
--
ALTER TABLE `officelocation`
  MODIFY `OfficeLocationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `otheremployeesspecifickra`
--
ALTER TABLE `otheremployeesspecifickra`
  MODIFY `EmpSpecificKRAId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `projectmaster`
--
ALTER TABLE `projectmaster`
  MODIFY `ProjectId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  MODIFY `RolePermissionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `salarytemplatecomponents`
--
ALTER TABLE `salarytemplatecomponents`
  MODIFY `TemplateComponentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `salarytemplates`
--
ALTER TABLE `salarytemplates`
  MODIFY `TemplateId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `standardkraforjobfunction`
--
ALTER TABLE `standardkraforjobfunction`
  MODIFY `StandardKRAId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `staticcalculationmethods`
--
ALTER TABLE `staticcalculationmethods`
  MODIFY `CalculationMethodId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `staticcomponents`
--
ALTER TABLE `staticcomponents`
  MODIFY `ComponentId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staticdocumenttypes`
--
ALTER TABLE `staticdocumenttypes`
  MODIFY `DocumentTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `staticjobfunctions`
--
ALTER TABLE `staticjobfunctions`
  MODIFY `JobFunctionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `statickra`
--
ALTER TABLE `statickra`
  MODIFY `KRAId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `staticleavetypes`
--
ALTER TABLE `staticleavetypes`
  MODIFY `LeaveId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `staticpages`
--
ALTER TABLE `staticpages`
  MODIFY `PageId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `staticpermissions`
--
ALTER TABLE `staticpermissions`
  MODIFY `PermissionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `staticroles`
--
ALTER TABLE `staticroles`
  MODIFY `RoleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `staticsalarycomponents`
--
ALTER TABLE `staticsalarycomponents`
  MODIFY `SalaryComponentsId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `staticstatus`
--
ALTER TABLE `staticstatus`
  MODIFY `StatusId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `taskcategorymaster`
--
ALTER TABLE `taskcategorymaster`
  MODIFY `TaskCategoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tasktype`
--
ALTER TABLE `tasktype`
  MODIFY `TaskTypeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `taxesmaster`
--
ALTER TABLE `taxesmaster`
  MODIFY `TaxId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `timesheet`
--
ALTER TABLE `timesheet`
  MODIFY `TimeSheetId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `userroles`
--
ALTER TABLE `userroles`
  MODIFY `UserRoleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ar_type_master`
--
ALTER TABLE `ar_type_master`
  ADD CONSTRAINT `ar_type_master_ibfk_1` FOREIGN KEY (`SalaryComponentId`) REFERENCES `staticsalarycomponents` (`SalaryComponentsId`) ON UPDATE NO ACTION;

--
-- Constraints for table `componentdetails`
--
ALTER TABLE `componentdetails`
  ADD CONSTRAINT `componentdetails_ibfk_1` FOREIGN KEY (`PageId`) REFERENCES `staticpages` (`PageId`),
  ADD CONSTRAINT `componentdetails_ibfk_2` FOREIGN KEY (`ComponentId`) REFERENCES `staticcomponents` (`ComponentId`);

--
-- Constraints for table `employeeactionnotification`
--
ALTER TABLE `employeeactionnotification`
  ADD CONSTRAINT `employeeactionnotification_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`),
  ADD CONSTRAINT `employeeactionnotification_ibfk_2` FOREIGN KEY (`RoleId`) REFERENCES `staticroles` (`RoleId`);

--
-- Constraints for table `employeeattendance`
--
ALTER TABLE `employeeattendance`
  ADD CONSTRAINT `employeeattendance_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`);

--
-- Constraints for table `employeefamily`
--
ALTER TABLE `employeefamily`
  ADD CONSTRAINT `employeefamily_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`);

--
-- Constraints for table `employeefinance`
--
ALTER TABLE `employeefinance`
  ADD CONSTRAINT `employeefinance_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`),
  ADD CONSTRAINT `employeefinance_ibfk_2` FOREIGN KEY (`StatusId`) REFERENCES `staticstatus` (`StatusId`);

--
-- Constraints for table `employeeleavebalances`
--
ALTER TABLE `employeeleavebalances`
  ADD CONSTRAINT `employeeleavebalances_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`),
  ADD CONSTRAINT `employeeleavebalances_ibfk_2` FOREIGN KEY (`LeaveTypeId`) REFERENCES `staticleavetypes` (`LeaveId`);

--
-- Constraints for table `employeeleaves`
--
ALTER TABLE `employeeleaves`
  ADD CONSTRAINT `employeeleaves_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`),
  ADD CONSTRAINT `employeeleaves_ibfk_2` FOREIGN KEY (`LeaveTypeId`) REFERENCES `staticleavetypes` (`LeaveId`),
  ADD CONSTRAINT `employeeleaves_ibfk_3` FOREIGN KEY (`StatusId`) REFERENCES `staticstatus` (`StatusId`);

--
-- Constraints for table `employeeleavetransactions`
--
ALTER TABLE `employeeleavetransactions`
  ADD CONSTRAINT `employeeleavetransactions_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`),
  ADD CONSTRAINT `employeeleavetransactions_ibfk_2` FOREIGN KEY (`leavetypeId`) REFERENCES `staticleavetypes` (`LeaveId`);

--
-- Constraints for table `employeepackagedetails`
--
ALTER TABLE `employeepackagedetails`
  ADD CONSTRAINT `employeepackagedetails_ibfk_1` FOREIGN KEY (`SalaryComponentId`) REFERENCES `staticsalarycomponents` (`SalaryComponentsId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `employeepackagedetails_ibfk_2` FOREIGN KEY (`EmployeePackageId`) REFERENCES `employeepackages` (`EmployeePackageId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `employeepackages`
--
ALTER TABLE `employeepackages`
  ADD CONSTRAINT `employeepackages_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `employeepackages_ibfk_2` FOREIGN KEY (`SalaryTemplateId`) REFERENCES `salarytemplates` (`TemplateId`);

--
-- Constraints for table `employeepayslip`
--
ALTER TABLE `employeepayslip`
  ADD CONSTRAINT `employeepayslip_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`),
  ADD CONSTRAINT `employeepayslip_ibfk_2` FOREIGN KEY (`StatusId`) REFERENCES `staticstatus` (`StatusId`);

--
-- Constraints for table `employeepayslipcomponents`
--
ALTER TABLE `employeepayslipcomponents`
  ADD CONSTRAINT `employeepayslipcomponents_ibfk_1` FOREIGN KEY (`PayslipId`) REFERENCES `employeepayslip` (`PayslipId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `employeepayslipcomponents_ibfk_2` FOREIGN KEY (`SalaryComponentId`) REFERENCES `staticsalarycomponents` (`SalaryComponentsId`) ON UPDATE NO ACTION;

--
-- Constraints for table `employeepayslipdeductions`
--
ALTER TABLE `employeepayslipdeductions`
  ADD CONSTRAINT `employeepayslipdeductions_ibfk_1` FOREIGN KEY (`PayslipId`) REFERENCES `employeepayslip` (`PayslipId`);

--
-- Constraints for table `employeepayslippayments`
--
ALTER TABLE `employeepayslippayments`
  ADD CONSTRAINT `employeepayslippayments_ibfk_1` FOREIGN KEY (`PayslipId`) REFERENCES `employeepayslip` (`PayslipId`),
  ADD CONSTRAINT `employeepayslippayments_ibfk_2` FOREIGN KEY (`StatusId`) REFERENCES `staticstatus` (`StatusId`) ON UPDATE NO ACTION;

--
-- Constraints for table `employeeperformance`
--
ALTER TABLE `employeeperformance`
  ADD CONSTRAINT `employeeperformance_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`);

--
-- Constraints for table `employeeperformancedetails`
--
ALTER TABLE `employeeperformancedetails`
  ADD CONSTRAINT `employeeperformancedetails_ibfk_1` FOREIGN KEY (`PerformanceId`) REFERENCES `employeeperformance` (`PerformanceId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `employeeperformancedetails_ibfk_2` FOREIGN KEY (`StandardKRAId`) REFERENCES `statickra` (`KRAId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `employeeperformancedetails_ibfk_3` FOREIGN KEY (`EmpSpecificKRAId`) REFERENCES `otheremployeesspecifickra` (`EmpSpecificKRAId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `employeesalary`
--
ALTER TABLE `employeesalary`
  ADD CONSTRAINT `employeesalary_ibfk_1` FOREIGN KEY (`StatusId`) REFERENCES `staticstatus` (`StatusId`);

--
-- Constraints for table `employeesalarytemplate`
--
ALTER TABLE `employeesalarytemplate`
  ADD CONSTRAINT `employeesalarytemplate_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `employeesalarytemplate_ibfk_2` FOREIGN KEY (`StatusId`) REFERENCES `staticstatus` (`StatusId`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `employeetaxesapplicable`
--
ALTER TABLE `employeetaxesapplicable`
  ADD CONSTRAINT `employeetaxesapplicable_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`),
  ADD CONSTRAINT `employeetaxesapplicable_ibfk_2` FOREIGN KEY (`TaxId`) REFERENCES `taxesmaster` (`TaxId`),
  ADD CONSTRAINT `employeetaxesapplicable_ibfk_3` FOREIGN KEY (`StatusId`) REFERENCES `staticstatus` (`StatusId`);

--
-- Constraints for table `employee_ar_invoice_adjusment`
--
ALTER TABLE `employee_ar_invoice_adjusment`
  ADD CONSTRAINT `employee_ar_invoice_adjusment_ibfk_1` FOREIGN KEY (`ARInvoiceId`) REFERENCES `employee_salary_ar_invoice` (`ARInvoiceId`),
  ADD CONSTRAINT `employee_ar_invoice_adjusment_ibfk_2` FOREIGN KEY (`PayslipId`) REFERENCES `employeepayslip` (`PayslipId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `employee_salary_ar_invoice`
--
ALTER TABLE `employee_salary_ar_invoice`
  ADD CONSTRAINT `employee_salary_ar_invoice_ibfk_1` FOREIGN KEY (`ARTypeId`) REFERENCES `ar_type_master` (`ARTypeId`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `employee_salary_ar_invoice_ibfk_2` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_ibfk_2` FOREIGN KEY (`ParentId`) REFERENCES `menus` (`MenuId`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `otheremployeesspecifickra`
--
ALTER TABLE `otheremployeesspecifickra`
  ADD CONSTRAINT `otheremployeesspecifickra_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`);

--
-- Constraints for table `project_budget`
--
ALTER TABLE `project_budget`
  ADD CONSTRAINT `project_budget_ibfk_1` FOREIGN KEY (`ProjectId`) REFERENCES `projectmaster` (`ProjectId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `project_budget_ibfk_2` FOREIGN KEY (`TaskTypeId`) REFERENCES `tasktype` (`TaskTypeId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `project_team`
--
ALTER TABLE `project_team`
  ADD CONSTRAINT `project_team_ibfk_1` FOREIGN KEY (`ProjectId`) REFERENCES `projectmaster` (`ProjectId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `project_team_ibfk_2` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`) ON UPDATE NO ACTION;

--
-- Constraints for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  ADD CONSTRAINT `rolepermissions_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `staticroles` (`RoleId`),
  ADD CONSTRAINT `rolepermissions_ibfk_2` FOREIGN KEY (`PermissionId`) REFERENCES `staticpermissions` (`PermissionId`);

--
-- Constraints for table `salarytemplatecomponents`
--
ALTER TABLE `salarytemplatecomponents`
  ADD CONSTRAINT `salarytemplatecomponents_ibfk_1` FOREIGN KEY (`CalculationMethodId`) REFERENCES `staticcalculationmethods` (`CalculationMethodId`),
  ADD CONSTRAINT `salarytemplatecomponents_ibfk_2` FOREIGN KEY (`SalaryComponentId`) REFERENCES `staticsalarycomponents` (`SalaryComponentsId`),
  ADD CONSTRAINT `salarytemplatecomponents_ibfk_3` FOREIGN KEY (`TemplateId`) REFERENCES `salarytemplates` (`TemplateId`),
  ADD CONSTRAINT `salarytemplatecomponents_ibfk_4` FOREIGN KEY (`DependentOnComponentId`) REFERENCES `salarytemplatecomponents` (`TemplateComponentId`) ON DELETE SET NULL ON UPDATE NO ACTION;

--
-- Constraints for table `standardkraforjobfunction`
--
ALTER TABLE `standardkraforjobfunction`
  ADD CONSTRAINT `standardkraforjobfunction_ibfk_1` FOREIGN KEY (`KRAId`) REFERENCES `statickra` (`KRAId`);

--
-- Constraints for table `staticleavetypes`
--
ALTER TABLE `staticleavetypes`
  ADD CONSTRAINT `staticleavetypes_ibfk_1` FOREIGN KEY (`StatusId`) REFERENCES `staticstatus` (`StatusId`);

--
-- Constraints for table `staticpages`
--
ALTER TABLE `staticpages`
  ADD CONSTRAINT `staticpages_ibfk_1` FOREIGN KEY (`MenuId`) REFERENCES `menus` (`MenuId`);

--
-- Constraints for table `staticroles`
--
ALTER TABLE `staticroles`
  ADD CONSTRAINT `staticroles_ibfk_1` FOREIGN KEY (`StatusId`) REFERENCES `staticstatus` (`StatusId`);

--
-- Constraints for table `taskcategorymaster`
--
ALTER TABLE `taskcategorymaster`
  ADD CONSTRAINT `taskcategorymaster_ibfk_1` FOREIGN KEY (`TaskTypeId`) REFERENCES `tasktype` (`TaskTypeId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `timesheet`
--
ALTER TABLE `timesheet`
  ADD CONSTRAINT `timesheet_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `timesheet_ibfk_2` FOREIGN KEY (`ProjectId`) REFERENCES `projectmaster` (`ProjectId`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `timesheet_ibfk_3` FOREIGN KEY (`TaskCategoryId`) REFERENCES `taskcategorymaster` (`TaskCategoryId`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `timesheet_ibfk_4` FOREIGN KEY (`UpdatedBy`) REFERENCES `employees` (`EmployeeId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`EmployeeId`) REFERENCES `employees` (`EmployeeId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`RoleId`) REFERENCES `staticroles` (`RoleId`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

ALTER TABLE `employees` ADD FOREIGN KEY (`StatusId`) REFERENCES `staticstatus`(`StatusId`) ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE `timesheet` ADD `Attachment` VARCHAR(100) NULL AFTER `Details`;
CREATE TABLE `employees`.`static_project_roles` (`ProjectRoleId` INT NOT NULL AUTO_INCREMENT , `DisplayDescription` VARCHAR(100) NOT NULL , `ParentId` INT NULL , PRIMARY KEY (`ProjectRoleId`), UNIQUE (`DisplayDescription`)) ENGINE = InnoDB;
ALTER TABLE `static_project_roles` ADD FOREIGN KEY (`ParentId`) REFERENCES `static_project_roles`(`ProjectRoleId`) ON DELETE RESTRICT ON UPDATE NO ACTION;
TRUNCATE TABLE `project_team`;
ALTER TABLE `project_team` ADD `ProjectRoleId` INT NOT NULL AFTER `EmployeeId`;
ALTER TABLE `project_team` ADD FOREIGN KEY (`ProjectRoleId`) REFERENCES `static_project_roles`(`ProjectRoleId`) ON DELETE RESTRICT ON UPDATE NO ACTION;

INSERT INTO `employees`.`employeeperformance` (`PerformanceId`, `EmployeeId`, `FromDate`, `ToDate`, `ManagerScore`, `EmpSelfScore`, `FinalAgreedScore`, `FinalReviewComments`, `HRComments`) VALUES (NULL, '3', '2023-02-28 18:30:00', '2023-03-30 18:30:00', '4', '4', '4', 'Final Review Comment', 'HR Comments');
INSERT INTO `employees`.`employeeperformance` (`PerformanceId`, `EmployeeId`, `FromDate`, `ToDate`, `ManagerScore`, `EmpSelfScore`, `FinalAgreedScore`, `FinalReviewComments`, `HRComments`) VALUES (NULL, '4', '2023-02-28 18:30:00', '2023-03-30 18:30:00', '3', '3', '3', 'Final Review Comment', 'HR Comments');
INSERT INTO `employees`.`employeeperformance` (`PerformanceId`, `EmployeeId`, `FromDate`, `ToDate`, `ManagerScore`, `EmpSelfScore`, `FinalAgreedScore`, `FinalReviewComments`, `HRComments`) VALUES (NULL, '5', '2023-02-28 18:30:00', '2023-03-30 18:30:00', '2', '4', '3', 'Final Review Comment', 'HR Comments');
INSERT INTO `employees`.`employeeperformance` (`PerformanceId`, `EmployeeId`, `FromDate`, `ToDate`, `ManagerScore`, `EmpSelfScore`, `FinalAgreedScore`, `FinalReviewComments`, `HRComments`) VALUES (NULL, '6', '2023-02-28 18:30:00', '2023-03-30 18:30:00', '1', '2', '2', 'Final Review Comment', 'HR Comments');

INSERT INTO `employees`.`staticpermissions` (`Permission`, `PermissionDescription`, `Code`) VALUES ('EmployeeDocument - Reject', 'Document', 'EDRE');
INSERT INTO `employees`.`staticpermissions` (`Permission`, `PermissionDescription`, `Code`) VALUES ('EmployeeDocument - Approve', 'Document', 'EDAPP');
INSERT INTO `employees`.`staticpermissions` (`Permission`, `PermissionDescription`, `Code`) VALUES ('EmployeeDocument', 'Document', 'EDVI');
UPDATE `employees`.`staticpermissions` SET `Permission` = 'EmployeeDocument - View' WHERE (`PermissionId` = '92');

INSERT INTO `employees`.`employeeleaves` (`LeavesId`, `EmployeeId`, `LeaveApplyDate`, `LeaveFromDate`, `LeaveToDate`, `LeaveTypeId`, `ApprovalStatusId`, `Remarks`, `StatusId`) VALUES ('1', '3', '2023-04-19', '2023-04-19', '2023-04-24', '5', '3', 'Test Reason', '1');
INSERT INTO `employees`.`employeeleaves` (`LeavesId`, `EmployeeId`, `LeaveApplyDate`, `LeaveFromDate`, `LeaveToDate`, `LeaveTypeId`, `ApprovalStatusId`, `Remarks`, `StatusId`) VALUES ('2', '3', '2023-04-25', '2023-04-25', '2023-04-25', '5', '3', 'Test Reason', '1');

INSERT INTO `employees`.`holidaymaster` (`HolidayId`, `HolidayWeekDay`, `HolidayDate`, `HolidayName`, `HolidaySaka`, `HolidayComments`, `CreatedBy`, `CreatedAt`, `CommentsStatus`) VALUES ('7', 'Tuesday', '2023-04-20', 'Mahavir Jayanti', 'चैत्र 17', 'Mahavir Janma Kalyanak is one of the most important religious festivals in Jainism. It celebrates the birth of Mahavir, the twenty-fourth and last Tirthankara of present Avasarpiṇī.', '1', '2023-03-14', '3');

INSERT INTO `employees`.`static_project_roles` (`ProjectRoleId`, `DisplayDescription`) VALUES ('1', 'Project Manager');
INSERT INTO `employees`.`static_project_roles` (`ProjectRoleId`, `DisplayDescription`, `ParentId`) VALUES ('2', 'Project Lead', '1');
INSERT INTO `employees`.`static_project_roles` (`ProjectRoleId`, `DisplayDescription`, `ParentId`) VALUES ('3', 'Developer', '2');
INSERT INTO `employees`.`static_project_roles` (`ProjectRoleId`, `DisplayDescription`, `ParentId`) VALUES ('4', 'QA Lead', '1');
INSERT INTO `employees`.`static_project_roles` (`ProjectRoleId`, `DisplayDescription`, `ParentId`) VALUES ('5', 'Tester', '4');

INSERT INTO `employees`.`project_team` (`ProjectId`, `EmployeeId`, `ProjectRoleId`, `CreatedDate`) VALUES ('2', '3', '1', '2023-04-20 04:16:45');

ALTER TABLE `companyinformation` ADD `Code` VARCHAR(100) NOT NULL DEFAULT uuid() AFTER `CompanyId`, ADD UNIQUE (`Code`);
ALTER TABLE `companyinformation` ADD `IsDefault` BOOLEAN NOT NULL DEFAULT FALSE AFTER `Code`;
UPDATE `companyinformation` SET `IsDefault` = '1' WHERE `companyinformation`.`CompanyId` = 1;
ALTER TABLE `employees` ADD `CompanyId` INT NOT NULL DEFAULT '1' AFTER `EmployeeId`;
ALTER TABLE `employees` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `staticdocumenttypes` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `staticdocumenttypes` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `staticleavetypes` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `staticleavetypes` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `staticroles` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `staticroles` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `staticjobfunctions` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `staticjobfunctions` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `statickra` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `statickra` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `staticsalarycomponents` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `staticsalarycomponents` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `static_project_roles` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `static_project_roles` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `salarytemplates` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `salarytemplates` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `projectmaster` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `projectmaster` ADD FOREIGN KEY(`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
-- INSERT INTO `rolepermissions` (`RolePermissionId`, `RoleId`, `PermissionId`) VALUES (NULL, '7', '80');
ALTER TABLE `taskcategorymaster` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `taskcategorymaster` ADD FOREIGN KEY(`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;
UPDATE `companyinformation` SET `Logo` = 'Static/WiseLogoFinal.png' WHERE `companyinformation`.`CompanyId` = 1;
ALTER TABLE `timesheet` ADD `RoleId` INT NULL AFTER `EmployeeId`;
ALTER TABLE `timesheet` ADD FOREIGN KEY(`RoleId`) REFERENCES `static_project_roles`(`ProjectRoleId`) ON DELETE RESTRICT ON UPDATE NO ACTION;
SET SQL_SAFE_UPDATES = 0;
UPDATE timesheet ts INNER JOIN project_team pt ON pt.EmployeeId=ts.EmployeeId AND pt.ProjectId=ts.ProjectId SET ts.RoleId=pt.ProjectRoleId;
ALTER TABLE `static_project_roles` DROP INDEX `DisplayDescription`;
ALTER TABLE `static_project_roles` ADD UNIQUE(`DisplayDescription`, `CompanyId`);
ALTER TABLE `projectmaster` DROP INDEX `ProjectName`;
ALTER TABLE `projectmaster` ADD UNIQUE(`ProjectName`, `CompanyId`);
ALTER TABLE `taskcategorymaster` ADD UNIQUE(`TaskCategoryName`, `CompanyId`);
ALTER TABLE `staticroles` ADD `IsReserved` BOOLEAN NOT NULL DEFAULT FALSE AFTER `CompanyId`;
UPDATE `staticroles` SET `IsReserved` = '1' WHERE `staticroles`.`RoleId` = 7;
ALTER TABLE `holidaymaster` ADD `CompanyId` INT NOT NULL DEFAULT '1';
ALTER TABLE `holidaymaster` ADD FOREIGN KEY (`CompanyId`) REFERENCES `companyinformation`(`CompanyId`) ON DELETE CASCADE ON UPDATE NO ACTION;