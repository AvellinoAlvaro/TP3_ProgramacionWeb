const express = require('express');
const router = express.Router();
const DB = require('../db');

/**
 * Middleware para verificar que existe el empleado con parámetro id
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns 
 */
async function checkSalary(req,res,next){
    const empleado = await DB.Salarios.getById(req.params.id);
    if(!empleado){        
        return res.status(404).send('Empleado no encontrado !!!')
    }
    // se guarda el objeto encontrado en la propiedad locals
    // para que pueda ser usado en los siguientes eslabones de la cadena
    res.locals.empleado=empleado.emp_no;
    
    next();
}

router.get('/',async (req,res)=>{
    res.send('Hola Salarios!!!')
});

router.get('/:id',checkSalary,async (req,res)=>{     
    const historial = await DB.Salarios.getActualSalary(res.locals.empleado);    
    res.status(200).json(historial)
});
module.exports=router;