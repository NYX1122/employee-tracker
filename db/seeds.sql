INSERT INTO department (name)
VALUES
    ('Sales'), ('Engineering'), ('Finance'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Salesperson', 80000, 1),
    ('Sales Lead', 100000, 1),
    ('Software Engineer', 120000, 2),
    ('Lead Engineer', 150000, 2),
    ('Accountant', 125000, 3),
    ('Lawyer', 190000, 4),
    ('Legal Team Lead', 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Ashley', 'Rodriguez', 4, null),
    ('Kevin', 'Tupik', 2, null),
    ('Sarah', 'Lourd', 7, null),
    ('John', 'Doe', 1, 2),
    ('Mike', 'Chan', 3, 1),
    ('Malia', 'Brown', 5, 3),
    ('Tom', 'Allen', 3, 1),
    ('Tanner', 'Galal', 3, 1),
    ('John', 'Smith', 1, 2),
    ('Amy', 'Jenkins', 6, 3);