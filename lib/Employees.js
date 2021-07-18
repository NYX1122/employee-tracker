const dbFunction = require('../util/dbPromise');
const db = require('../db/connection');

const getAllEmployees = () => {
    return dbFunction(`SELECT e.id, e.first_name, e.last_name, role.title, department.name, role.salary, 
    CONCAT(m.first_name, ' ', m.last_name) AS 'Manager' 
    FROM employee e 
    LEFT JOIN role 
    ON e.role_id = role.rid
    LEFT JOIN department 
    ON role.department_id = department.did 
    LEFT JOIN employee m 
    ON m.id = e.manager_id 
    GROUP BY e.id`);
}

module.exports = getAllEmployees;
