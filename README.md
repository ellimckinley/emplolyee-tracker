# Employee Tracker

## Description
The Employee Tracker is a command-line application used to manage employee data for a company. It allows users to view and manage departments, roles, and employees in a company database. The application provides a user-friendly interface to perform various operations such as adding new departments, roles, and employees, as well as updating employee roles and viewing detailed information about the company's structure.

## Table of Contents
- [Installation Instructions](#installation-instructions)
- [Usage Information](#usage-information)
- [License](#license)
- [Technologies Used](#technologies-used)
- [Contribution Guidelines](#contribution-guidelines)
- [Testing Instructions](#testing-instructions)
- [Contact](#contact)

## Installation Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/ellimckinley/employee-tracker.git
    ```
2. Navigate to the project directory:
    ```bash
    cd employee-tracker
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
1. Log into PostgreSQL:
    ```bash
    psql -U your_username
    ```
2. Run the schema.sql file to set up the database schema:
    ```bash
    \i db/schema.sql
    ```
3. Run the seeds.sql file to populate the database with initial data:
    ```bash
    \i db/seeds.sql
    ```
4. In the terminal, run the following command to start the application:
    ```bash
    node index.js
    ```

## Usage Information
1. Use up and down arrows to select the action you would like to take.
2. Press enter to select action.
3. Proceed through prompts in terminal to complete each action.

[Application Demo]()

## License
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the [MIT](https://opensource.org/licenses/MIT) license.

## Technologies Used
- JavaScript
- Node.js
- PostgreSQL
- Inquirer

## Contribution Guidelines
Not accepting contributions at this time.

## Testing Instructions
Acceptance criteria as follows:

WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee's first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database


## Contact
For additional questions and instructions, please contact me at [elli.mckinley@gmail.com](mailto:elli.mckinley@gmail.com).

Checkout my other GitHub projects: @ellimckinley.

