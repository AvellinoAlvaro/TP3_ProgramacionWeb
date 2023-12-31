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
      `SELECT e.emp_no, e.last_name, e.first_name, s.salary FROM ${TABLE} e INNER JOIN salaries s ON (e.emp_no = s.emp_no) WHERE e.emp_no=? AND s.to_date=?`,
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
