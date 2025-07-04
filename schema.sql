CREATE TYPE gaf_user_status AS ENUM (
    'unregistered',
    'registered',
    'submitted',
    'approved',
    'standby',
    'declined',
    'paid',
    'imported'
    );

CREATE TYPE gaf_user_type AS ENUM (
    'user',
    'admin'
    );



DROP TABLE gaf_user_log;
DROP TYPE gaf_user_log_type;
DROP TABLE gaf_user;

CREATE TABLE IF NOT EXISTS gaf_user
(
    id           SERIAL PRIMARY KEY,
    type         gaf_user_type      NOT NULL,
    email        VARCHAR(64) UNIQUE NOT NULL,
    password     VARCHAR(256)       NULL,
    first_name   VARCHAR(64)        NULL,
    last_name    VARCHAR(64)        NULL,
    company_name VARCHAR(64)        NULL,
    address      VARCHAR(128)       NULL,
    city         VARCHAR(32)        NULL,
    state        VARCHAR(10)        NULL,
    zipcode      VARCHAR(10)        NULL,
    phone        VARCHAR(16)        NULL,
    phone2       VARCHAR(16)        NULL,
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
    CONSTRAINT fk_artist
        FOREIGN KEY (user_id)
            REFERENCES gaf_user (id)
);

-- DROP FUNCTION search_path_by_keywords;
-- CREATE FUNCTION search_path_by_keywords(keywordList TEXT, resultLimit INTEGER default 15)
--     RETURNS TABLE
--             (
--                 path  VARCHAR(64),
--                 count BIGINT
--             )
--     AS
-- $$
-- DECLARE
-- keywords VARCHAR(64)[];
-- --     searchKeywords      VARCHAR(256);
-- BEGIN
--     keywords = string_to_array(lower(keywordList), ',');
-- RETURN QUERY
-- SELECT sp.path, sum(spk.count) as count
-- FROM search_path_keywords spk
--     JOIN search_paths sp ON sp.id = spk.path_id
--     JOIN search_keywords sk on spk.keyword_id = sk.id
-- WHERE sk.keyword = ANY (keywords)
-- GROUP BY sp.path
-- ORDER BY count DESC
--     LIMIT resultLimit;
-- END
-- $$ LANGUAGE plpgsql;
