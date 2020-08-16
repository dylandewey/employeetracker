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

                case "View Employees":
                    viewEmployee();
                    break;

                case "View Roles":
                    viewRoles();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
};

start();

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        let myRol = res.map(rol => {
            return ({
                name: rol.title,
                value: rol.id
            })
        })
        connection.query("SELECT * FROM employee", function (err, res) {
            if (err) throw err
            let myEmp = res.map(emp => {
                return ({
                    name: `${emp.first_name} ${emp.last_name}`,
                    value: emp.id
                })
            })
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
                    },
                    {
                        type: "list",
                        name: "roleId",
                        message: "Employee's Role:",
                        choices: myRol
                    },
                    {
                        type: "list",
                        name: "managerId",
                        message: "Employee's Manager:",
                        choices: myEmp,
                        when: function (answers) {
                            return myEmp.length > 0
                        }
                    }
                ])

                .then(function (answer) {
                    if (!answer.managerId) {
                        let query = "INSERT INTO employee set ?";
                        connection.query(query, {
                            first_name: answer.firstname,
                            last_name: answer.lastname,
                            role_Id: answer.rollId,
                        },

                            function (err) {
                                if (err) throw err;
                                console.table(answer);
                                start();
                            });
                    }
                    else {
                        let query = "INSERT INTO employee set ?";
                        connection.query(query, {
                            first_name: answer.firstname,
                            last_name: answer.lastname,
                            role_Id: answer.rollId,
                            manager_Id: answer.managerId
                        },
                            function (err) {
                                if (err) throw err;
                                console.table(answer);
                                start();
                            });
                    }
                })
        })
    })
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
                    start();
                })
        })
}

function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err
        let addDeptId = res.map(dep => {
            return ({
                name: dep.name,
                value: dep.id
            })
        })

        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Enter Employee Title",
                    name: "addtitle"
                },
                {
                    type: "input",
                    message: "Enter Role Salary",
                    name: "addsalary"
                },
                {
                    type: "input",
                    message: "Enter Department ID for New Role",
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
                        console.table(answer);
                        start();
                    })
            })
    })
}

function viewEmployee() {
    let viewEmp = "SELECT * FROM employee";
    connection.query(viewEmp, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
};

function viewRoles() {
    let viewRole = "SELECT * FROM role";
    connection.query(viewRole, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
};