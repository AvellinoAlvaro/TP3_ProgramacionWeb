require("dotenv").config();
const app = require("../src/app");
const request = require("supertest");

describe("Rest API Empleados", () => {
    it("PUT /api/v1/empleados/10001", async() => {
        const response = await request(app).get("/api/v1/empleados/10001");
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(200);
        const salario = response.body;
        expect(salario).toBeDefined();
        expect(salario.length > 1).toBe(true)
        salario.map((periodoDeCobro) => {
            expect(periodoDeCobro.emp_no === 10001).toBe(true)
        })
    })
});

//Punto 2.b

describe('Pruebas para obtener el listado de sueldos de un empleado por emp_no', () => {
    // 1. Comprobar que los datos ingresados sean correctos.
    it('Debería obtener un error si se proporciona un emp_no no válido', async () => {
      const response = await request(app).get('/api/v1/salarios/invalid_emp_no'); // Reemplazar con un emp_no inválido
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(400); // Código de estado para datos incorrectos
      expect(response.text).toBe('Emp_no inválido'); // Mensaje de error esperado
    });
  
    // 2. Comprobar que los códigos de estado del protocolo HTTP sean correctos.
    it('Debería devolver el código de estado 200 si se proporciona un emp_no válido', async () => {
      const response = await request(app).get('/api/v1/salarios/10010'); // Reemplazar con un emp_no existente en tu base de datos
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200); // Código de estado exitoso
    });
  
    // 3. Comprobar que el arreglo que se obtiene de la API tiene más de un elemento.
    it('Debería devolver un arreglo con más de un elemento para un emp_no válido', async () => {
      const response = await request(app).get('/api/v1/salarios/10010'); // Reemplazar con un emp_no existente en tu base de datos
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
      const salarios = response.body;
      expect(Array.isArray(salarios)).toBe(true);
      expect(salarios.length).toBeGreaterThan(1); // Verificar que tenga más de un elemento
    });
  
    // 4. Comprobar que cada uno de los elementos del arreglo pertenece al empleado.
    it('Debería asegurar que cada elemento del arreglo pertenece al empleado con emp_no válido', async () => {
      const response = await request(app).get('/api/v1/salarios/10010'); // Reemplazar con un emp_no existente en tu base de datos
      expect(response).toBeDefined();
      expect(response.statusCode).toBe(200);
      const salarios = response.body;
      expect(Array.isArray(salarios)).toBe(true);
  
      // Verificar que cada elemento en el arreglo pertenece al empleado con emp_no 10010
      salarios.forEach((salario) => {
        expect(salario.emp_no).toBe(10010); // Reemplazar con el emp_no esperado
        // Agrega más validaciones según la estructura de tus datos
      });
    });
  });



  //Punto 2.c

describe('Pruebas para modificar el sueldo de un empleado', () => {
  // 1. Comprobar que los datos ingresados sean correctos.
  it('Debería obtener un error si se proporciona un emp_no no válido', async () => {
    const response = await request(app)
      .put('/api/v1/salarios/modificar/invalid_emp_no') // Reemplazar con un emp_no inválido
      .send({ nuevo_salario: 50000 }); // Reemplazar con el nuevo salario
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400); // Código de estado para datos incorrectos
    expect(response.text).toBe('Emp_no inválido'); // Mensaje de error esperado
  });

  // 2. Comprobar que los códigos de estado del protocolo HTTP sean correctos.
  it('Debería devolver el código de estado 200 si se proporciona un emp_no válido', async () => {
    const response = await request(app)
      .put('/api/v1/salarios/modificar/10010') // Reemplazar con un emp_no existente en tu base de datos
      .send({ nuevo_salario: 50000 }); // Reemplazar con el nuevo salario
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200); // Código de estado exitoso
  });

  
});

