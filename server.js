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

                case "Find all artists who appear more than once":
                    multiSearch();
                    break;

                case "Find data within a specific range":
                    rangeSearch();
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

                    start();
                });
        });
}

function addDepartment() {
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

                    start();
                });
        }

function rangeSearch() {
                inquirer
                    .prompt([
                        {
                            name: "start",
                            type: "input",
                            message: "Enter starting position: ",
                            validate: function (value) {
                                if (isNaN(value) === false) {
                                    return true;
                                }
                                return false;
                            }
                        },
                        {
                            name: "end",
                            type: "input",
                            message: "Enter ending position: ",
                            validate: function (value) {
                                if (isNaN(value) === false) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    ])
                    .then(function (answer) {
                        var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
                        connection.query(query, [answer.start, answer.end], function (err, res) {
                            if (err) throw err;
                            for (var i = 0; i < res.length; i++) {
                                console.log(
                                    "Position: " +
                                    res[i].position +
                                    " || Song: " +
                                    res[i].song +
                                    " || Artist: " +
                                    res[i].artist +
                                    " || Year: " +
                                    res[i].year
                                );
                            }
                            runSearch();
                        });
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