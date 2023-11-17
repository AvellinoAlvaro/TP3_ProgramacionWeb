const pool = require("./connection.db");
const TABLE = "salaries";

/**
 * Retorna un departamento por su clave primaria
 * @returns
 */
module.exports.getById = async function (id) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(`SELECT * FROM ${TABLE} d WHERE emp_no=?`, [
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
 * Retorna todos los departamentos
 * @returns
 */
module.exports.getActualSalary = async function (empleado) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      `select * from salaries where emp_no=${empleado}`
    );
    return rows;
  } catch (err) {
    return Promise.reject(err);
  } finally {
    if (conn) await conn.release();
  }
};