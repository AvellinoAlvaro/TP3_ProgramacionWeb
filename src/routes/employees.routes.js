const express = require("express");
const router = express.Router();
const DB = require("../db");

/**
 * Middleware para verificar que existe el empleado con parámetro id
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns
 */
async function checkEmployee(req, res, next) {
  const employee = await DB.Employees.getById(req.params.id);
  if (!employee) {
    return res.status(404).send("Empleado no encontrado!!!");
  }
  // se guarda el objeto encontrado en la propiedad locals
  // para que pueda ser usado en los siguientes eslabones de la cadena
  res.locals.employee = employee;
  next();
}

// GET /api/v1/empleados
router.get("/", async (req, res) => {
  const employees = await DB.Employees.getAll();
  res.status(200).json(employees);
});

// GET /api/v1/empleados/:id
router.get("/:id", checkEmployee, (req, res) => {
  res.status(200).json(res.locals.employee);
});

// PUT /api/v1/empleados/update-salary/:id
router.put("/update-salary/:id", checkEmployee, async (req, res) => {
  try {
    let employee = await DB.Employees.getById(req.params.id);
    const newSalary = req.body.newSalary;
    const success = await DB.Employees.updateEmployeeSalary(
      employee,
      newSalary
    );
    employee = await DB.Employees.getByIdWithLastSalary(req.params.id);
    if (success) res.status(200).json(employee);
  } catch (exception) {
    res.status(500).send(exception.message);
  }
});

router.put("/change-department/:id", checkEmployee, async (req,res) => {
    try {
        const newDepartment = req.body.newDepartment
    } catch (exception) {
        res.status(500).send(exception.message);
    }
});

module.exports = router;
