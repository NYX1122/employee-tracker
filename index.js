const inquirer = require('inquirer');
const getAllEmployees = require('./lib/Employees');

const mainMenu = (start) => {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Edit departments', 'Edit roles', 'Edit employees']
        })
        .then(({ choice }) => {
            if (choice === 'View all departments') {
                console.log('View all departments');
                mainMenu();
            } else if (choice === 'View all roles') {
                console.log('View all roles')
                mainMenu();
            } else if (choice === 'View all employees') {
                const data = getAllEmployees();
                console.log(data);
                //mainMenu();
            } else if (choice === 'Edit departments') {
                console.log('Edit departments');
                mainMenu();
            } else if (choice === 'Edit roles') {
                console.log('Edit roles');
                mainMenu();
            } else if (choice === 'Edit employees') {
                console.log('Edit employees');
                mainMenu();
            }
        });

}

mainMenu();