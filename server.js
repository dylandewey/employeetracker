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
                'Update Employee Role',
                //In progress
                // 'Remove Employee',
                // 'Remove Role',
                // 'Remove Department',
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

                case "View Departments":
                    viewDepartments();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                // In progress
                // case "Remove Employee":
                //     removeEmployee();
                //     break;

                case "Done":
                    connection.end();
                    break;

                default:
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
                            role_Id: answer.roleId,
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
        let addDeptId = [];
        if (err) throw err
        addDeptId = res.map(dep => ({
            id: dep.id,
            name: dep.name
        }))
        console.log(addDeptId);
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
                    type: "list",
                    message: "Enter Department ID for New Role",
                    name: 'id',
                    choices: addDeptId.map(department => (
                        {
                            name: department.name,
                            value: department.id
                        }
                    ))
                }
            ])

            .then(function (answer) {
                let query = "INSERT INTO role set ?";
                connection.query(query, {
                    title: answer.addtitle,
                    salary: answer.addsalary,
                    department_id: answer.id
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
    let viewRole = "SELECT * FROM role LEFT JOIN department on role.department_id = department.id";
    connection.query(viewRole, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
};

function viewDepartments() {
    let viewRole = "SELECT * FROM department";
    connection.query(viewRole, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
};

function updateEmployeeRole() {
    let updEmpRol = "SELECT * FROM role";
    connection.query(updEmpRol, function (err, data) {
        if (err) throw err;
        let updRole = data.map(rol => {
            return ({
                name: `${rol.title} ${rol.salary} ${rol.department_id}`,
                value: rol.id
            })
        })
        let updDep = "SELECT * FROM department";
        connection.query(updDep, function (departmentError, departmentData) {
            if (departmentError) throw departmentError;
            let updDept = departmentData.map(rol => {
                return ({
                    name: `${rol.name}`,
                    value: rol.id
                })
            })
            inquirer
                .prompt([
                    {
                        type: "rawlist",
                        name: "updateEmployeeRole",
                        choices: updRole,
                        message: "What role would you like to update"
                    },
                    {
                        type: "input",
                        name: "newtitle",
                        message: "New Title"
                    },
                    {
                        type: "input",
                        name: "newsalary",
                        message: "New Salary"
                    },
                    {
                        type: "rawlist",
                        name: "newdepartment",
                        message: "New Department",
                        choices: updDept
                    }
                ])
                .then(function (answer) {
                    let chosenItemId;
                    for (let i = 0; i < departmentData.length; i++) {
                        if (departmentData[i].id === answer.updateEmployeeRole) {
                            chosenItemId = departmentData[i].id;
                        }
                    }
                    connection.query(
                        "UPDATE role SET ? WHERE ?",
                        [
                            {
                                title: answer.newtitle,
                                salary: answer.newsalary,
                                department_id: answer.newdepartment
                            },
                            {
                                id: chosenItemId
                            }
                        ],
                        function (err, data) {
                            if (err) throw err
                            console.log(data);
                            start();
                        }
                    )
                })
        })

    });
};


// In progress
// function removeEmployee() {
//     let delEmployee = [];
//     connection.query(delEmployee, function (err, data) {
//         if (err) throw err;
//         delEmployee = data.map(del => {
//             return ({
//                 name: `${del.title} ${del.salary} ${del.department_id}`,
//                 value: del.id
//             })
//                 .then(employee => {
//                     for (i = 0; i < employee.length; i++) {
//                         delEmployee.push(employee[i].employee);
//                     }
//                     inquirer.prompt(
//                         {
//                             name: "employee",
//                             type: "list",
//                             message: "Which Employee would you like to delete?",
//                             choices: delEmployee
//                         })
//                 })
//         })
//         let removeEmp = "DELETE FROM employee WHERE employee id = {employeeID}";
//         connection.query(removeEmp, function (err, data) {
//             if (err) throw err;
//             console.table(data);
//             start();
//         });
//     })
// }

