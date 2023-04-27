
-- Database: `wiseemployee`
--

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `CityId` int(11) NOT NULL,
  `CityShortCode` char(2) NOT NULL,
  `City` varchar(50) NOT NULL,
  `CityGrpId` int(11) NOT NULL,
  `CityGrpName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `reportingmanager`
--

CREATE TABLE `reportingmanager` (
  `ReportingManagerId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `ManagerId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `userleaves`
--

CREATE TABLE `userleaves` (
  `LeaveId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `FromDate` date NOT NULL,
  `ToDate` int(11) NOT NULL,
  `EmergencyPhone` int(11) NOT NULL,
  `LeaveType` int(11) NOT NULL,
  `Reason` varchar(300) NOT NULL,
  `Approved` tinyint(1) NOT NULL DEFAULT '0',
  `ApproveDate` datetime NOT NULL,
  `DenyReason` varchar(300) DEFAULT NULL,
  `ApprovedByUserId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `EmployeeCode` varchar(30) DEFAULT NULL,
  `Designation` varchar(60) DEFAULT NULL,
  `FullName` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `FatherName` varchar(50) NOT NULL,
  `MotherName` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `PermanentAddress` varchar(150) NOT NULL,
  `CommunicationAddress` varchar(150) NOT NULL,
  `DOB` date NOT NULL,
  `DOJ` date NOT NULL,
  `EmergencyPhone` varchar(50) NOT NULL,
  `Phone` varchar(50) NOT NULL,
  `Qualifications` varchar(100) NOT NULL,
  `ProfileImage` varchar(100) NOT NULL,
  `IdentityProof` varchar(100) NOT NULL,
  `AddressProof` varchar(100) NOT NULL,
  `ReportingManagerId` int(11) DEFAULT NULL,
  `Approved` int(11) NOT NULL DEFAULT '0',
  `UserStatus` char(2) NOT NULL DEFAULT 'I',
  `IsManager` tinyint(1) NOT NULL DEFAULT '0',
  `IsHR` tinyint(1) NOT NULL DEFAULT '0',
  `TimeStamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LastModified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`CityId`);

--
-- Indexes for table `reportingmanager`
--
ALTER TABLE `reportingmanager`
  ADD PRIMARY KEY (`ReportingManagerId`),
  ADD KEY `FK_RMUsersUserId` (`UserId`),
  ADD KEY `FK_RMManagerIdUsersUserId` (`ManagerId`);

--
-- Indexes for table `userleaves`
--
ALTER TABLE `userleaves`
  ADD PRIMARY KEY (`LeaveId`),
  ADD KEY `FK_UsersUserId` (`UserId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `CityId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reportingmanager`
--
ALTER TABLE `reportingmanager`
  MODIFY `ReportingManagerId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userleaves`
--
ALTER TABLE `userleaves`
  MODIFY `LeaveId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reportingmanager`
--
ALTER TABLE `reportingmanager`
  ADD CONSTRAINT `FK_RMManagerIdUsersUserId` FOREIGN KEY (`ManagerId`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `FK_RMUsersUserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `userleaves`
--
ALTER TABLE `userleaves`
  ADD CONSTRAINT `FK_UsersUserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserID`);
COMMIT;

--
-- Table structure for table `performance`
--

CREATE TABLE `performance` (
  `PerformanceId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `FromDate` date NOT NULL,
  `ToDate` date NOT NULL,
  `KeyRatingAria` varchar(500) DEFAULT NULL,
  `EmployeeDescription` varchar(500) DEFAULT NULL,
  `ManagerDescription` varchar(500) DEFAULT NULL,
  `EmployeeRating` int(11) DEFAULT NULL,
  `ManagerRating` int(11) DEFAULT NULL,
  `FinalRating` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `performance`
--
ALTER TABLE `performance`
  ADD PRIMARY KEY (`PerformanceId`),
  ADD KEY `UserId` (`UserId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `performance`
--
ALTER TABLE `performance`
  MODIFY `PerformanceId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `performance`
--
ALTER TABLE `performance`
  ADD CONSTRAINT `performance_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;
