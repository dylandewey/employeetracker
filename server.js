const connection = require('./db/db.js');
const inquirer = require('inquirer');
const mysql = require('mysql');


function start() {
    inquirer
        .prompt({
            name: 'what',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Add Employee',
                'Add Department',
                'Add Role',
                'View Employees',
                'View Roles',
                'View Departments',
                'View Employees by Manager',
                'Update Employee Role',
                'Update Employee Manager',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Done'
            ]
        })

        .then(function (answer) {
            console.log(answer);
            switch (answer.what) {
                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Search for a specific song":
                    songSearch();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "firstname",
                type: "input",
                message: "Employee's First Name:"
            },
            {
                name: "lastname",
                type: "input",
                message: "Employee's Last Name:"
            }
        ])

        .then(function (answer) {
            let query = "INSERT INTO employee set ?";
            connection.query(query, {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: null,
                manager_id: null
            },

                function (err) {
                    if (err) throw err;
                    console.table(answer);
                });
            start();
        });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "New Department Name: "
            },
        ])

        .then(function (answer) {
            let query = "INSERT INTO department set ?";
            connection.query(query, {
                name: answer.department
            },

                function (err) {
                    if (err) throw err;
                });

            console.table(answer);
            start();
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter Employee Title",
                name: "addtitle"
            },
            {
                type: "input",
                message: "Enter Employee Salary",
                name: "addsalary"
            },
            {
                type: "input",
                message: "Enter Employee Department ID",
                name: "addDeptId"
            }
        ])

        .then(function (answer) {
            let query = "INSERT INTO role set ?";
            connection.query(query, {
                title: answer.addtitle,
                salary: answer.addsalary,
                department_id: answer.addDepId
            },

                function (err) {
                    if (err) throw err;
                });

            console.table(answer);
            start();
        });
}

function songSearch() {
    inquirer
        .prompt({
            name: "song",
            type: "input",
            message: "What song would you like to look for?"
        })
        .then(function (answer) {
            console.log(answer.song);
            connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function (err, res) {
                if (err) throw err;
                console.log(
                    "Position: " +
                    res[0].position +
                    " || Song: " +
                    res[0].song +
                    " || Artist: " +
                    res[0].artist +
                    " || Year: " +
                    res[0].year
                );
                runSearch();
            });
        });
}