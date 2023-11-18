const pool = require("./connection.db");
const TABLE = "employees";

/**
 * Retorna todos los empleados
 * @returns
 */
module.exports.getAll = async function () {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLE} e `);
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retorna un empleado por su clave primaria
 * @returns {}
 */
module.exports.getById = async function (id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLE} e WHERE emp_no=?`, [
      id,
    ]);
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Retorna un empleado por su clave primaria
 * @returns {}
 */
module.exports.getByIdWithLastSalary = async function (id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT e.emp_no, e.last_name, e.first_name, s.salary s.from_date, s.to_date FROM ${TABLE} e INNER JOIN salaries s ON (e.emp_no = s.emp_no) WHERE e.emp_no=? AND s.to_date=?`,
      [id, "9999-01-01"]
    );
    return rows[0];
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Updates an employee's salary
 * @param {} employee
 * @param number newSalary
 * @returns boolean
 */
module.exports.updateEmployeeSalary = async function (employee, newSalary) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const now = new Date().toISOString().split("T")[0];
    const lastDate = "9999-01-01";
    let SQL = `UPDATE salaries SET to_date=? WHERE to_date=? AND emp_no=?`;
    let params = [now, lastDate, employee.emp_no];
    const updateResult = await conn.query(SQL, params);

    SQL = `INSERT INTO salaries (emp_no, salary, from_date, to_date) VALUES(?,?,?,?)`;
    params = [employee.emp_no, newSalary, now, lastDate];
    const insertResult = await conn.query(SQL, params);
    conn.commit();
    return true;
  } catch (err) {
    conn.rollback();
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};

/**
 * Updates an employee's department
 * @param {} employee
 * @param number newDepartment
 * @returns boolean
 */
module.exports.updateEmployeeDeparment = async function (
  employee,
  newDepartment
) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();
    const now = new Date().toISOString().split("T")[0];
    const lastDate = "9999-01-01";
    let SQL = `UPDATE dept_emp SET to_date=? WHERE to_date=? AND emp_no=?`;
    let params = [now, lastDate, employee.emp_no];
    const updateResult = await conn.query(SQL, params);

    // Consulta para validar si el empleado ya trabajo en el nuevo departamento previamente
    SQL = `SELECT COUNT (*) as count FROM dept_emp WHERE emp_no=? AND dept_no=?`;
    let exists = await conn.query(SQL, [employee.emp_no, newDepartment.dept_no]);
    exists = exists[0].count;
    // Si trabajo previamente en el nuevo depto, modifica las fechas del registro existente
    let updateDeptEmpResult = undefined;
    if (exists) {
      SQL = `UPDATE dept_emp SET from_date=?, to_date=? WHERE emp_no=? AND dept_no LIKE ?`;
      updateDeptEmpResult = await conn.query(SQL, [
        now,
        lastDate,
        employee.emp_no,
        newDepartment.dept_no,
      ]);
    }
    // Si no existe registro con esas claves inserto uno nuevo
    else {
      SQL = `INSERT INTO dept_emp (emp_no, dept_no, from_date, to_date) VALUES(?,?,?,?)`;
      params = [employee.emp_no, newDepartment.dept_no, now, lastDate];
      updateDeptEmpResult = await conn.query(SQL, params);
    }
    if (updateResult && updateDeptEmpResult) conn.commit();
    return true;
  } catch (err) {
    conn.rollback();
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};
