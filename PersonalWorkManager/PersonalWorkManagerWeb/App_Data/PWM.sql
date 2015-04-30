BEGIN TRANSACTION;

-- Parameter
CREATE TABLE "Parameter" (
    `Id`                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `Name`              VARCHAR(200) NOT NULL UNIQUE,
    `Value`             VARCHAR(2000),
    `Description`       VARCHAR(1000)
);
INSERT INTO `Parameter` VALUES (1,'Sample parameter','Sample value','Sample Dewcription');

-- StatusType
CREATE TABLE "StatusType" (
    `Id`                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `Name`              VARCHAR(200) NOT NULL UNIQUE,
    `Description`       VARCHAR(1000)
);
INSERT INTO `StatusType` VALUES (1,'Project',NULL);
INSERT INTO `StatusType` VALUES (2,'Task',NULL);
INSERT INTO `StatusType` VALUES (3,'Alert',NULL);
INSERT INTO `StatusType` VALUES (4,'Resource',NULL);

-- Status
CREATE TABLE "Status" (
    `Id`                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `Name`              VARCHAR(200) NOT NULL,
    `Description`       VARCHAR(1000),
    `Order`             INTEGER NOT NULL,
    `IdStatusType`      INTEGER NOT NULL,
    FOREIGN KEY(`IdStatusType`) REFERENCES StatusType ( Id )
);
INSERT INTO `Status` VALUES (1,'Active','Active',1,1);
INSERT INTO `Status` VALUES (2,'Active','Active',1,2);
INSERT INTO `Status` VALUES (3,'Active','Active',1,3);
INSERT INTO `Status` VALUES (4,'Active','Active',1,4);

-- Resource
CREATE TABLE "Resource" (
    `Id`                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `Login`             VARCHAR(100) NOT NULL UNIQUE,
    `Name`              VARCHAR(200) NOT NULL,
    `Password`          VARCHAR(1000),
    `IdStatus`          INTEGER NOT NULL,
    FOREIGN KEY(`IdStatus`) REFERENCES Status ( id )
);
INSERT INTO `Resource` VALUES (1,'Admin','Admin','',4);

-- Project
CREATE TABLE "Project" (
    `Id`                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `Code`              VARCHAR(20) NOT NULL UNIQUE,
    `Name`              VARCHAR(200) NOT NULL UNIQUE,
    `Description`       VARCHAR(1000),
    `StartDate`         DATETIME NOT NULL,
    `EndDate`           DATETIME,
    `EstimatedDuration` INTEGER,
    `IdStatus`          INTEGER NOT NULL,
    FOREIGN KEY(`IdStatus`) REFERENCES Status ( Id )
);
INSERT INTO `Project` VALUES (1,'PR_#1','Test Project','Test project description','2015-01-27 00:01:00',NULL,NULL,1);

-- Task
CREATE TABLE "Task" (
    `Id`                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `Name`              VARCHAR(200) NOT NULL,
    `Description`       VARCHAR(1000),
    `Order`             INTEGER NOT NULL,
    `IdProject`         INTEGER NOT NULL,
    `IdStatus`          INTEGER NOT NULL,
    FOREIGN KEY(`IdProject`) REFERENCES Project ( Id ),
    FOREIGN KEY(`IdStatus`) REFERENCES Status ( Id )
);
INSERT INTO `Task` VALUES (1,'Task 1','Task 1 description',1,1,2);

-- Alert
CREATE TABLE "Alert" (
    `Id`                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `Name`              VARCHAR(200) NOT NULL,
    `Description`       VARCHAR(1000),
    `DueDate`           DATE NOT NULL,
    `IdProject`         INTEGER,
    FOREIGN KEY(`IdProject`) REFERENCES Project ( Id )
);
INSERT INTO `Alert` VALUES (1,'Alert 1','Alert 1 description','2015-01-11 00:04:00',1);

-- Note
CREATE TABLE "Note" (
    `Id`                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `Text`              VARCHAR(4000),
    `IdProject`         INTEGER,
    FOREIGN KEY(`IdProject`) REFERENCES Project ( Id )
);
INSERT INTO `Note` VALUES (1,'Note 1',1);

-- Session
CREATE TABLE "Session" (
    `Id`                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `StartTime`         DATE NOT NULL,
    `EndTime`           DATE NOT NULL,
    `IdTask`            INTEGER NOT NULL,
    `IdResource`        INTEGER NOT NULL,
    FOREIGN KEY(`IdTask`) REFERENCES Task ( Id ),
    FOREIGN KEY(`IdResource`) REFERENCES Status ( Id )
);
COMMIT;
