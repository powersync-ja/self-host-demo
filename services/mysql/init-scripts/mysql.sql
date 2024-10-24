-- Create a user with necessary privileges
CREATE USER 'repl_user'@'%' IDENTIFIED BY 'good_password';

-- Grant replication client privilege
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'repl_user'@'%';

-- Grant access to the specific database
GRANT ALL PRIVILEGES ON powersync.* TO 'repl_user'@'%';

-- Apply changes
FLUSH PRIVILEGES;

CREATE TABLE lists (
    id CHAR(36) NOT NULL DEFAULT (UUID()), -- String UUID (36 characters)
    created_at VARCHAR(50) NULL,
    name TEXT NOT NULL,
    owner_id  CHAR(36) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE todos (
    id CHAR(36) NOT NULL DEFAULT (UUID()), -- String UUID (36 characters)
    created_at VARCHAR(50) NULL,
    completed_at VARCHAR(50) NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_by  CHAR(36) NULL,
    completed_by  CHAR(36) NULL,
    list_id  CHAR(36) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);

INSERT INTO lists (id, name, owner_id)
VALUES 
    (UUID(), 'Do a demo', UUID());