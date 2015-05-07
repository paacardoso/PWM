# PWM
Personal Work Manager

## Development requirements
- Visual studio 2010 sp1 (.NET 4.0)
- Internet Information Services 6/7
- SQLLite connector (System.Data.SQLite)
  - Url: http://system.data.sqlite.org/index.html/doc/trunk/www/downloads.wiki
  - File: sqlite-netFx40-setup-bundle-x86-2010-1.0.93.0.exe
  This connector is required to update the Model.adms file, if database schema has changed.
- Stylecop;
- JSLint;
- DB Browser for SQLite;


## Development configurations
- IIS 6
  - Directory Security configuration
    Allow "Anonymous Acsess"
    Allow "Integrated Windows Authentication"
- Stylecop
  Load xml file configuration available in web project folder (Settings.StyleCop). Stylecop usually auto load this file.
- JSLint
  Load xml file configuration available in web project folder (Settings.JSLint.xml). JSLint DOES NOT auto load this file.
- SQLite
  Unzip "PWM\PersonalWorkManager\PersonalWorkManagerWeb\App_Data\PWM_clean.zip" into the same directory.
  Use DB Browser for SQLite to maintain data and schema.


## Development guidelines
- Must compile without JSLint warnings
- Must compile without Stylecop warnings
