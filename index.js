const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const allDepartments = `SELECT * FROM department`;
const allRoles = `SELECT rid, title, name, salary FROM role LEFT JOIN department ON role.department_id = department.did GROUP BY role.rid`;
const allEmployees = `SELECT e.id, e.first_name, e.last_name, role.title, department.name, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS 'Manager' FROM employee e LEFT JOIN role ON e.role_id = role.rid LEFT JOIN department ON role.department_id = department.did LEFT JOIN employee m ON m.id = e.manager_id GROUP BY e.id`


const mainMenu = () => {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Edit employees']
        })
        .then(({ choice }) => {
            if (choice === 'View all departments') {
                getData(allDepartments);
            } else if (choice === 'View all roles') {
                getData(allRoles);
            } else if (choice === 'View all employees') {
                getData(allEmployees);
            } else if (choice === 'Add a department') {
                add(choice);
            } else if (choice === 'Add a role') {
                add(choice);
            } else if (choice === 'Edit employees') {
                editEmployees();
            }
        });

}

const add = (choice) => {
    let which = lastWord(choice);

    if (which === 'department') {
        inquirer
            .prompt({
                type: 'text',
                name: 'name',
                message: 'Name of new department?'
            })
            .then(({ name }) => {
                const query = `INSERT INTO department (name) VALUES ('${name}')`;
                changeData(query);
            });
    } else if (which === 'role') {
        let choicesArr = [];
        db.promise().query(`SELECT name FROM department`)
        .then(([rows, fields]) => {
            rows.forEach(name => {
                choicesArr.push(name.name);
            });
        });

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Name of new role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Salary of new role?'
                },
                {
                    type: 'rawlist',
                    name: 'department',
                    message: 'Please select a department for this new role-',
                    choices: choicesArr,
                    filter: (val) => {
                        return choicesArr.indexOf(val) + 1;
                    }
                }
            ])
            .then(({ title, salary, department }) => {
                changeData(`INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', '${department}')`);
            });
    }
}

const editEmployees = () => {
    let roleChoicesArr = [];
    let managerChoicesArr = [];
    let managerInfo = [];
    let employeeNameArr = [];

    db.promise().query(`SELECT title FROM role`)
    .then(([rows, fields]) => {
        rows.forEach(name => {
            roleChoicesArr.push(name.title);
        });
    });

    db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS Manager FROM employee WHERE employee.manager_id IS NULL`)
    .then(([rows, fields]) => {
        managerInfo = rows;
        rows.forEach(name => {
            managerChoicesArr.push(name.Manager);
        });
    });

    db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employee`)
    .then(([rows, fields]) => {
        rows.forEach(name => {
            employeeNameArr.push(name.employee);
        });
    });
    inquirer
        .prompt({
            type: 'list',
            name: 'choice',
            message: 'What would you like to do next?',
            choices: ['Add a new employee', 'Update an existing employee']
        })
        .then(({choice}) => {
            if (choice === 'Add a new employee') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'First name?'
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'Last Name?'
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is their title?',
                            choices: roleChoicesArr,
                            filter: (val) => {
                                return roleChoicesArr.indexOf(val) + 1;
                            }
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is their manager?',
                            choices: managerChoicesArr,
                            filter: (val) => {
                                index = managerChoicesArr.indexOf(val);
                                return managerInfo[index].id;
                            }
                        }
                    ])
                    .then(({ firstName, lastName, role, manager }) => {
                        changeData(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', '${role}', '${manager}')`);
                    });
            } else if (choice === 'Update an existing employee') {
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Which employee would you like to update?',
                            choices: employeeNameArr,
                            filter: (val) => {
                                return employeeNameArr.indexOf(val) + 1;
                            }
                        },
                        {
                            type: 'list',
                            name: 'newRole',
                            message: 'Please choose a new title',
                            choices: roleChoicesArr,
                            filter: (val) => {
                                return roleChoicesArr.indexOf(val) + 1;
                            }
                        }
                    ])
                    .then(({ employee, newRole }) => {
                        db.promise().query(`UPDATE employee SET role_id = ${newRole} WHERE id = ${employee}`)
                        .then((result) => {
                            console.log('Success');
                            mainMenu();
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    })
            }
        })
}

const updateEmployees = () => {

}

const getData = (query) => {
    db.promise().query(query)
    .then(([rows, fields]) => {
        console.table(rows);
    })
    .then(() => {
        mainMenu();
    })
    .catch(err => {
        console.log(err);
    });
}

const changeData = (query) => {
    db.promise().query(query)
    .then((result) => {
        console.log('Success');
        mainMenu();
    })
    .catch(err => {
        console.log(err);
    });
}

function lastWord(words) {
    let n = words.replace(/[\[\]?.,\/#!$%\^&\*;:{}=\\|_~()]/g, "").split(" ");
    return n[n.length - 1];
}

mainMenu();