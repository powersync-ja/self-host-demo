-- Create a user with necessary privileges
CREATE USER 'repl_user'@'%' IDENTIFIED BY 'good_password';

-- Grant replication client privilege
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'repl_user'@'%';

-- Grant access to the specific database
GRANT ALL PRIVILEGES ON mydatabase.* TO 'repl_user'@'%';

-- Apply changes
FLUSH PRIVILEGES;

CREATE TABLE lists (
    id BINARY(16) NOT NULL DEFAULT (UNHEX(REPLACE(UUID(), '-', ''))),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    owner_id BINARY(16) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE todos (
    id BINARY(16) NOT NULL DEFAULT (UNHEX(REPLACE(UUID(), '-', ''))),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BINARY(16) NULL,
    completed_by BINARY(16) NULL,
    list_id BINARY(16) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);