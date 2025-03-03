INSERT INTO department (name) VALUES
('SKI PATROL'),
('SKI SCHOOL'),
('TICKETING'), 
('RENTALS');

INSERT INTO role (title, salary, department_id) VALUES
('BASIC SKI PATROL', 50000, (SELECT id FROM department WHERE name = 'SKI PATROL')),
('MFWIC', 50050, (SELECT id FROM department WHERE name = 'SKI PATROL')),
('INSTRUCTOR', 70000, (SELECT id FROM department WHERE name = 'SKI SCHOOL')),
('TICKET SELLER', 45000, (SELECT id FROM department WHERE name = 'TICKETING')),
('BOOT FITTER', 50000, (SELECT id FROM department WHERE name = 'RENTALS'));

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Rick', 'OMortis', (SELECT id FROM role WHERE title = 'MFWIC'), NULL),
('Frank', 'Frye', (SELECT id FROM role WHERE title = 'INSTRUCTOR'), NULL),
('Stan', 'InDline', (SELECT id FROM role WHERE title = 'TICKET SELLER'), NULL),
('Ben', 'Dings', (SELECT id FROM role WHERE title = 'BOOT FITTER'), NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Patty', 'Roller', (SELECT id FROM role WHERE title = 'BASIC SKI PATROL'), (SELECT id FROM employee WHERE first_name = 'Rick' AND last_name = 'OMortis'));

-- SELECT * FROM department;
-- SELECT * FROM role;
-- SELECT * FROM employee;