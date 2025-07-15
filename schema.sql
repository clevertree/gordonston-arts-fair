DROP TABLE IF EXISTS gaf_transactions;
DROP TABLE IF EXISTS gaf_user;
DROP TABLE IF EXISTS gaf_user_log;
DROP TYPE IF EXISTS gaf_user_status;
DROP TYPE IF EXISTS gaf_user_type;
DROP TYPE IF EXISTS gaf_user_log_type;

CREATE TYPE gaf_user_status AS ENUM (
    'unregistered',
    'registered',
    'submitted',
    'approved',
    'standby',
    'declined',
    'paid',
    'imported',
    'admin'
    );

CREATE TYPE gaf_user_type AS ENUM (
    'user',
    'admin'
    );


CREATE TABLE IF NOT EXISTS gaf_user
(
    id           SERIAL PRIMARY KEY,
    type         gaf_user_type      NOT NULL,
    email        VARCHAR(64) UNIQUE NULL,
    phone        VARCHAR(64) UNIQUE NULL,
    first_name   VARCHAR(64)        NULL,
    last_name    VARCHAR(64)        NULL,
    company_name VARCHAR(64)        NULL,
    address      VARCHAR(128)       NULL,
    city         VARCHAR(32)        NULL,
    state        VARCHAR(10)        NULL,
    zipcode      VARCHAR(10)        NULL,
    phone2       VARCHAR(64)        NULL,
    website      VARCHAR(256)       NULL,
    description  TEXT               NULL,
    category     VARCHAR(128)       NULL,
    status       gaf_user_status    NOT NULL,
    created_at   TIMESTAMP          NOT NULL,
    updated_at   TIMESTAMP          NULL,
    uploads      JSON               NULL
);



CREATE TYPE gaf_user_log_type AS ENUM (
    'log-in',
    'log-in-error',
    'log-out',
    'register',
    'register-error',
    'password-reset',
    'password-reset-error',
    'message' ,
    'message-error',
    'status-change'
    );
CREATE TABLE IF NOT EXISTS gaf_user_log
(
    id         SERIAL PRIMARY KEY,
    user_id    INT               NULL,
    type       gaf_user_log_type NOT NULL,
    message    VARCHAR(256)      NOT NULL,
    created_at TIMESTAMP         NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES gaf_user (id)
            ON DELETE CASCADE
);


DROP TABLE IF EXISTS gaf_transactions;
CREATE TABLE IF NOT EXISTS gaf_transactions
(
    id         SERIAL PRIMARY KEY,
    user_id    INT            NULL,
    full_name  VARCHAR(256)   NULL,
    email      VARCHAR(256)   NULL,
    phone      VARCHAR(256)   NULL,
    type       VARCHAR(16)    NOT NULL CHECK (type IN ('charge.succeeded', 'charge.refunded')), -- Restricts the type to either 'email' or 'phone'
    amount     DECIMAL(10, 2) NULL,
    created_at TIMESTAMP      NOT NULL,
    content    JSON           NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
            REFERENCES gaf_user (id)
);

DROP TABLE IF EXISTS gaf_2fa_codes;
CREATE TABLE IF NOT EXISTS gaf_2fa_codes
(
    type       VARCHAR(16) NOT NULL CHECK (type IN ('email', 'phone')), -- Restricts the type to either 'email' or 'phone'
    receiver   VARCHAR(64) NOT NULL,
    code       INT         NOT NULL,                                    -- Assuming the code is a number
    expiration TIMESTAMP   NOT NULL,                                    -- Specifies the expiration of the code
    created_at TIMESTAMP   NOT NULL DEFAULT NOW(),                      -- Stores when the code was generated
    CONSTRAINT "uk_type_receiver_code" UNIQUE ("type", "receiver", "code")
);
