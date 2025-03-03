import inquirer from 'inquirer';
import pool from './db.js';
import 'console.table';

async function createTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS department (
                id SERIAL PRIMARY KEY,
                name VARCHAR(30) NOT NULL
            );
            CREATE TABLE IF NOT EXISTS role (
                id SERIAL PRIMARY KEY,
                title VARCHAR(30) NOT NULL,
                salary DECIMAL(10, 2) NOT NULL,
                department_id INTEGER NOT NULL,
                FOREIGN KEY (department_id) REFERENCES department(id)
            );
            CREATE TABLE IF NOT EXISTS employee (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(30) NOT NULL,
                last_name VARCHAR(30) NOT NULL,
                role_id INTEGER NOT NULL,
                manager_id INTEGER,
                FOREIGN KEY (role_id) REFERENCES role(id),
                FOREIGN KEY (manager_id) REFERENCES employee(id)
            );
        `);
        console.log('Tables created successfully.');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}

async function startApp() {
    await createTables();
    console.log(`
    --------------------------------------------------
    |                                                |
    |               EMPLOYEE MANAGER                 |
    |                                                |
    --------------------------------------------------
    `);

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update Employee Role',
                'Exit'
            ]
        }
    ]);

    switch (action) {
        case 'View All Departments':
            return viewDepartments();
        case 'View All Roles':
            return viewRoles();
        case 'View All Employees':
            return viewEmployees();
        case 'Add a Department':
            return addDepartment();
        case 'Add a Role':
            return addRole();
        case 'Add an Employee':
            return addEmployee();
        case 'Update Employee Role':
            return updateEmployeeRole();
        case 'Exit':
            console.log("You have exited the application. Thank you for using.");
            process.exit();
    }
}

// View all departments
async function viewDepartments() {
    try {
        const result = await pool.query('SELECT * FROM department;');
        console.table(result.rows);
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: 'Press Enter to continue...'
            }
        ]);
        startApp();
    } catch (err) {
        console.error('Error fetching departments:', err);
        startApp();
    }
}

// View all roles
async function viewRoles() {
    try {
        const result = await pool.query(`
            SELECT role.id, role.title, department.name AS department, role.salary
            FROM role
            LEFT JOIN department ON role.department_id = department.id;
        `);
        console.table(result.rows);
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: 'Press Enter to continue...'
            }
        ]);
        startApp();
    } catch (err) {
        console.error('Error fetching roles:', err);
        startApp();
    }
}

// View all employees
async function viewEmployees() {
    try {
        const result = await pool.query(`
            SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
                   COALESCE(manager.first_name || ' ' || manager.last_name, 'No Manager') AS manager
            FROM employee e
            LEFT JOIN role ON e.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON e.manager_id = manager.id;
        `);
        console.table(result.rows);
        await inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: 'Press Enter to continue...'
            }
        ]);
        startApp();
    } catch (err) {
        console.error('Error fetching employees:', err);
        startApp();
    }
}

// Add a department
async function addDepartment() {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the new department name:',
        }
    ]);

    try {
        await pool.query('INSERT INTO department (name) VALUES ($1);', [name]);
        console.log(`Added department: ${name}`);
        startApp();
    } catch (err) {
        console.error('Error adding department:', err);
    }
}

// Add a role
async function addRole() {
    const departments = await pool.query('SELECT * FROM department;');
    const departmentChoices = departments.rows.map(dept => ({
        name: dept.name,
        value: dept.id
    }));

    const { title, salary, department_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the new role title:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the role salary:',
            validate: input => !isNaN(input) ? true : 'Please enter a valid number'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for this role:',
            choices: departmentChoices
        }
    ]);

    try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);', [title, salary, department_id]);
        console.log(`Added role: ${title}`);
        startApp();
    } catch (err) {
        console.error('Error adding role:', err);
    }
}

// Add an employee
async function addEmployee() {
    const roles = await pool.query('SELECT * FROM role;');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id
    }));

    const employees = await pool.query('SELECT * FROM employee;');
    const managerChoices = employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));
    managerChoices.unshift({ name: 'No Manager', value: null });

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the employee first name:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employee last name:'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the employee role:',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the employee manager:',
            choices: managerChoices
        }
    ]);

    try {
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);',
            [first_name, last_name, role_id, manager_id]);
        console.log(`Added employee: ${first_name} ${last_name}`);
        startApp();
    } catch (err) {
        console.error('Error adding employee:', err);
    }
}

// Update employee role
async function updateEmployeeRole() {
    const employees = await pool.query('SELECT * FROM employee;');
    const employeeChoices = employees.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));

    const roles = await pool.query('SELECT * FROM role;');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id
    }));

    const { employee_id, new_role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'new_role_id',
            message: 'Select the new role:',
            choices: roleChoices
        }
    ]);

    try {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [new_role_id, employee_id]);
        console.log('Employee role updated successfully.');
        startApp();
    } catch (err) {
        console.error('Error updating employee role:', err);
    }
}

// // Update employee manager - BONUS
// async function updateEmployeeManager() {
//     const employees = await pool.query('SELECT * FROM employee;');
//     const employeeChoices = employees.rows.map(emp => ({
//         name: `${emp.first_name} ${emp.last_name}`,
//         value: emp.id
//     }));

//     const roles = await pool.query('SELECT * FROM role;');
//     const roleChoices = roles.rows.map(role => ({
//         name: role.title,
//         value: role.id
//     }));

//     const { employee_id, new_role_id } = await inquirer.prompt([
//         {
//             type: 'list',
//             name: 'employee_id',
//             message: 'Select the employee to update:',
//             choices: employeeChoices
//         },
//         {
//             type: 'list',
//             name: 'new_role_id',
//             message: 'Select the new role:',
//             choices: roleChoices
//         }
//     ]);

//     try {
//         await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [new_role_id, employee_id]);
//         console.log('Employee role updated successfully.');
//         startApp();
//     } catch (err) {
//         console.error('Error updating employee role:', err);
//     }
// }

// // View Employee by Manager - BONUS
// async function viewEmployeesByManager() {
//     const employees = await pool.query('SELECT * FROM employee;');
//     const employeeChoices = employees.rows.map(emp => ({
//         name: `${emp.first_name} ${emp.last_name}`,
//         value: emp.id
//     }));

//     const roles = await pool.query('SELECT * FROM role;');
//     const roleChoices = roles.rows.map(role => ({
//         name: role.title,
//         value: role.id
//     }));

//     const { employee_id, new_role_id } = await inquirer.prompt([
//         {
//             type: 'list',
//             name: 'employee_id',
//             message: 'Select the employee to update:',
//             choices: employeeChoices
//         },
//         {
//             type: 'list',
//             name: 'new_role_id',
//             message: 'Select the new role:',
//             choices: roleChoices
//         }
//     ]);

//     try {
//         await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [new_role_id, employee_id]);
//         console.log('Employee role updated successfully.');
//         startApp();
//     } catch (err) {
//         console.error('Error updating employee role:', err);
//     }
// }

// // View Employee by Department - BONUS
// async function viewEmployeesByDepartment() {
//     const employees = await pool.query('SELECT * FROM employee;');
//     const employeeChoices = employees.rows.map(emp => ({
//         name: `${emp.first_name} ${emp.last_name}`,
//         value: emp.id
//     }));

//     const roles = await pool.query('SELECT * FROM role;');
//     const roleChoices = roles.rows.map(role => ({
//         name: role.title,
//         value: role.id
//     }));

//     const { employee_id, new_role_id } = await inquirer.prompt([
//         {
//             type: 'list',
//             name: 'employee_id',
//             message: 'Select the employee to update:',
//             choices: employeeChoices
//         },
//         {
//             type: 'list',
//             name: 'new_role_id',
//             message: 'Select the new role:',
//             choices: roleChoices
//         }
//     ]);

//     try {
//         await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [new_role_id, employee_id]);
//         console.log('Employee role updated successfully.');
//         startApp();
//     } catch (err) {
//         console.error('Error updating employee role:', err);
//     }
// }

// // Delete Department - BONUS
// async function deleteDepartment() {
//     const employees = await pool.query('SELECT * FROM department;');
//     const employeeChoices = employees.rows.map(emp => ({
//         name: `${emp.first_name} ${emp.last_name}`,
//         value: emp.id
//     }));

//     const roles = await pool.query('SELECT * FROM role;');
//     const roleChoices = roles.rows.map(role => ({
//         name: role.title,
//         value: role.id
//     }));

//     const { employee_id, new_role_id } = await inquirer.prompt([
//         {
//             type: 'list',
//             name: 'employee_id',
//             message: 'Select the employee to update:',
//             choices: employeeChoices
//         },
//         {
//             type: 'list',
//             name: 'new_role_id',
//             message: 'Select the new role:',
//             choices: roleChoices
//         }
//     ]);

//     try {
//         await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [new_role_id, employee_id]);
//         console.log('Employee role updated successfully.');
//         startApp();
//     } catch (err) {
//         console.error('Error updating employee role:', err);
//     }
// }

// // Delete Role - BONUS
// async function deleteRole() {
//     const employees = await pool.query('SELECT * FROM role;');
//     const employeeChoices = employees.rows.map(emp => ({
//         name: `${emp.first_name} ${emp.last_name}`,
//         value: emp.id
//     }));

//     const roles = await pool.query('SELECT * FROM role;');
//     const roleChoices = roles.rows.map(role => ({
//         name: role.title,
//         value: role.id
//     }));

//     const { employee_id, new_role_id } = await inquirer.prompt([
//         {
//             type: 'list',
//             name: 'employee_id',
//             message: 'Select the employee to update:',
//             choices: employeeChoices
//         },
//         {
//             type: 'list',
//             name: 'new_role_id',
//             message: 'Select the new role:',
//             choices: roleChoices
//         }
//     ]);

//     try {
//         await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [new_role_id, employee_id]);
//         console.log('Employee role updated successfully.');
//         startApp();
//     } catch (err) {
//         console.error('Error updating employee role:', err);
//     }
// }

// // Delete Role - BONUS
// async function deleteEmployee() {
//     const employees = await pool.query('SELECT * FROM employee;');
//     const employeeChoices = employees.rows.map(emp => ({
//         name: `${emp.first_name} ${emp.last_name}`,
//         value: emp.id
//     }));

//     const roles = await pool.query('SELECT * FROM role;');
//     const roleChoices = roles.rows.map(role => ({
//         name: role.title,
//         value: role.id
//     }));

//     const { employee_id, new_role_id } = await inquirer.prompt([
//         {
//             type: 'list',
//             name: 'employee_id',
//             message: 'Select the employee to update:',
//             choices: employeeChoices
//         },
//         {
//             type: 'list',
//             name: 'new_role_id',
//             message: 'Select the new role:',
//             choices: roleChoices
//         }
//     ]);

//     try {
//         await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2;', [new_role_id, employee_id]);
//         console.log('Employee role updated successfully.');
//         startApp();
//     } catch (err) {
//         console.error('Error updating employee role:', err);
//     }
// }
// Start the app
startApp();

