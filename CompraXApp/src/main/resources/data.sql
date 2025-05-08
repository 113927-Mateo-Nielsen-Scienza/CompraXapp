// filepath: src/main/resources/data.sql
MERGE INTO roles (name) USING (VALUES ('ROLE_USER'), ('ROLE_ADMIN')) AS s(name)
ON roles.name = s.name
WHEN NOT MATCHED THEN
    INSERT (name) VALUES (s.name);

