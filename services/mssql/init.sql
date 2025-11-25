-- Create database (idempotent)
DECLARE @db sysname = '$(APP_DB)';
IF DB_ID(@db) IS NULL
BEGIN
  DECLARE @sql nvarchar(max) = N'CREATE DATABASE [' + @db + N'];';
EXEC(@sql);
END
GO

-- Enable CDC at the database level (idempotent)
DECLARE @db sysname = '$(APP_DB)';
DECLARE @cmd nvarchar(max) = N'USE [' + @db + N'];
IF EXISTS (SELECT 1 FROM sys.databases WHERE name = ''' + @db + N''' AND is_cdc_enabled = 0)
    EXEC sys.sp_cdc_enable_db;';
EXEC(@cmd);
GO


-- Create a SQL login (server) and user (db), then grant CDC read access
-- Note: 'cdc_reader' role is auto-created when CDC is enabled on the DB.
DECLARE @db sysname = '$(APP_DB)';
DECLARE @login sysname = '$(APP_LOGIN)';
DECLARE @password nvarchar(128) = '$(APP_PASSWORD)';
-- Create login if missing
IF NOT EXISTS (SELECT 1 FROM sys.server_principals WHERE name = @login)
BEGIN
  DECLARE @mklogin nvarchar(max) = N'CREATE LOGIN [' + @login + N'] WITH PASSWORD = ''' + @password + N''', CHECK_POLICY = ON;';
EXEC(@mklogin);
END;

-- Create user in DB if missing
DECLARE @mkuser nvarchar(max) = N'USE [' + @db + N'];
IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE name = ''' + @login + N''')
  CREATE USER [' + @login + N'] FOR LOGIN [' + @login + N'];';
EXEC(@mkuser);
GO

USE [MASTER];
GRANT VIEW SERVER PERFORMANCE STATE TO [$(APP_LOGIN)];
GO

USE [$(APP_DB)];
GRANT VIEW DATABASE PERFORMANCE STATE TO [$(APP_LOGIN)];
GO

-- Create PowerSync checkpoints table
USE [$(APP_DB)];
IF OBJECT_ID('dbo._powersync_checkpoints', 'U') IS NULL
BEGIN
  CREATE TABLE dbo._powersync_checkpoints (
    id INT IDENTITY PRIMARY KEY,
    last_updated DATETIME NOT NULL DEFAULT (GETDATE())
  );
END;

GRANT INSERT, UPDATE ON dbo._powersync_checkpoints TO [$(APP_LOGIN)];

-- Enable CDC for checkpoints table
DECLARE @enableCheckpointsTable nvarchar(max) =
'IF NOT EXISTS (
    SELECT 1
    FROM cdc.change_tables
    WHERE source_object_id = OBJECT_ID(N''dbo._powersync_checkpoints'')
)
BEGIN
  EXEC sys.sp_cdc_enable_table
    @source_schema = N''dbo'',
    @source_name   = N''_powersync_checkpoints'',
    @role_name     = N''cdc_reader'',
    @supports_net_changes = 1;
END;';
EXEC(@enableCheckpointsTable);
GO

-- Wait until capture job exists
DECLARE @tries int = 10;
WHILE @tries > 0 AND NOT EXISTS (
    SELECT 1 FROM msdb.dbo.cdc_jobs WHERE job_type = N'capture'
)
BEGIN
    WAITFOR DELAY '00:00:01';
    SET @tries -= 1;
END;

-- Set the CDC capture job polling interval to 1 second (default is 5 seconds)
-- Stops cdc job and restarts cdc job for new polling interval to take affect
-- Now it's safe
EXEC sys.sp_cdc_change_job @job_type = N'capture', @pollinginterval = 1;
GO

/* -----------------------------------------------------------
   Create tables and enable CDC on them.
   You must enable CDC per table to actually capture changes.
   Example below creates the demo tables and enables CDC on it.
------------------------------------------------------------*/

DECLARE @db sysname = '$(APP_DB)';
EXEC(N'USE [' + @db + N'];
IF OBJECT_ID(''dbo.lists'', ''U'') IS NULL
BEGIN
  CREATE TABLE dbo.lists (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(), -- GUID (36 characters),
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    name NVARCHAR(MAX) NOT NULL,
    owner_id UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT PK_lists PRIMARY KEY (id)
  );
END;
');

GRANT INSERT, UPDATE, DELETE ON dbo.lists TO [$(APP_LOGIN)];

EXEC(N'USE [' + @db + N'];
IF OBJECT_ID(''dbo.todos'', ''U'') IS NULL
BEGIN
  CREATE TABLE dbo.todos (
    id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(), -- GUID (36 characters)
    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    completed_at DATETIME2 NULL,
    description NVARCHAR(MAX) NOT NULL,
    completed BIT NOT NULL DEFAULT 0,
    created_by UNIQUEIDENTIFIER NULL,
    completed_by UNIQUEIDENTIFIER NULL,
    list_id UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT PK_todos PRIMARY KEY (id),
    CONSTRAINT FK_todos_lists FOREIGN KEY (list_id) REFERENCES dbo.lists(id) ON DELETE CASCADE
  );
END;
');

GRANT INSERT, UPDATE, DELETE ON dbo.todos TO [$(APP_LOGIN)];
GO

-- Enable CDC for dbo.lists (idempotent guard)
DECLARE @db sysname = '$(APP_DB)';
DECLARE @login sysname = '$(APP_LOGIN)';
DECLARE @enableListsTable nvarchar(max) = N'USE [' + @db + N'];
IF NOT EXISTS (
    SELECT 1
    FROM cdc.change_tables
    WHERE source_object_id = OBJECT_ID(N''dbo.lists'')
)
BEGIN
  EXEC sys.sp_cdc_enable_table
    @source_schema = N''dbo'',
    @source_name   = N''lists'',
    @role_name     = N''cdc_reader'',
    @supports_net_changes = 1;
END;';
EXEC(@enableListsTable);

-- Enable CDC for dbo.todos (idempotent guard)
DECLARE @enableTodosTable nvarchar(max) = N'USE [' + @db + N'];
IF NOT EXISTS (
    SELECT 1
    FROM cdc.change_tables
    WHERE source_object_id = OBJECT_ID(N''dbo.todos'')
)
BEGIN
  EXEC sys.sp_cdc_enable_table
    @source_schema = N''dbo'',
    @source_name   = N''todos'',
    @role_name     = N''cdc_reader'',
    @supports_net_changes = 1;
END;';
EXEC(@enableTodosTable);

-- Grant minimal rights to read CDC data:
--   1) read access to base tables (db_datareader)
--   2) membership in cdc_reader (allows selecting from CDC change tables & functions)
--   3) the cdc_reader role is only available once CDC is enabled on the database and some tables have been enabled for CDC
DECLARE @grant nvarchar(max) = N'USE [' + @db + N'];
IF NOT EXISTS (SELECT 1 FROM sys.database_role_members rm
               JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id AND r.name = ''db_datareader''
               JOIN sys.database_principals u ON rm.member_principal_id = u.principal_id AND u.name = ''' + @login + N''')
  ALTER ROLE db_datareader ADD MEMBER [' + @login + N'];

IF NOT EXISTS (SELECT 1 FROM sys.database_role_members rm
               JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id AND r.name = ''cdc_reader''
               JOIN sys.database_principals u ON rm.member_principal_id = u.principal_id AND u.name = ''' + @login + N''')
  ALTER ROLE cdc_reader ADD MEMBER [' + @login + N'];';
EXEC(@grant);
GO

DECLARE @db sysname = '$(APP_DB)';
EXEC(N'USE [' + @db + N'];
BEGIN
  INSERT INTO dbo.lists (id, name, owner_id)
  VALUES (NEWID(), ''Do a demo'', NEWID());
END;
');
GO