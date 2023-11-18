require("dotenv").config();
const app = require("../src/app");
const request = require("supertest");

describe("Rest API Departamentos", () => {
  it("GET /api/v1/departamentos", async () => {
    const response = await request(app).get("/api/v1/departamentos");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const deptos = response.body;
    expect(deptos.length).toBeGreaterThan(0);
  });

  it("GET /api/v1/departamentos/d009", async () => {
    const response = await request(app).get("/api/v1/departamentos/d009");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const depto = response.body;
    expect(depto).toBeDefined();
    expect(depto.dept_no).toBeDefined();
    expect(depto.dept_no).toBe("d009");
    expect(depto.dept_name).toBeDefined();
    expect(depto.dept_name).toBe("Customer Service");
  });

  it("GET /api/v1/departamentos/d009/manager", async () => {
    const response = await request(app).get("/api/v1/departamentos/d009/manager");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);
    const manager = response.body;
    expect(manager).toBeDefined();
    expect(manager.emp_no).toBeDefined();
    expect(manager.emp_no).toBe(111939);
    expect(manager.first_name).toBeDefined();
    expect(manager.first_name).toBe("Yuchang");
  });

  it("GET /api/v1/departamentos/d009/listado-managers", async () => {
    const response = await request(app).get("/api/v1/departamentos/d009/listado-managers");
    
    // Comprobar que la respuesta es válida
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200);

    const lista = response.body;

    // Comprobar que la lista es un arreglo
    expect(Array.isArray(lista)).toBe(true);

    // Comprobar que la lista tiene más de un elemento
    expect(lista.length).toBeGreaterThan(0);

    // Comprobar que cada elemento de la lista pertenece al departamento d009
    lista.forEach(item => {
      expect(item.dept_no).toBeDefined();
      expect(item.dept_no).toBe("d009");
    });
  });


  it("GET /api/v1/departamentos/d00999", async () => {
    const response = await request(app).get("/api/v1/departamentos/d00999");
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Departamento no encontrado!!!");
  });

  it("POST /api/v1/departamentos  sin parámetros", async () => {
    const response = await request(app).post("/api/v1/departamentos").send();
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("dept_no es Requerido!!!");
  });

  it("POST /api/v1/departamentos  sólo con dept_no", async () => {
    const depto = { dept_no: "d999" };
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("dept_name es Requerido!!!");
  });

  it("POST /api/v1/departamentos  sólo con dept_name", async () => {
    const depto = { dept_name: "Depto nueve nueve nueve" };
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("dept_no es Requerido!!!");
  });

  it("POST /api/v1/departamentos  departamento repetido!!!", async () => {
    const depto = { dept_no: "d009", dept_name: "Depto Cero Cero Nueve" };
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("ya existe el Departamento!!!");
  });

  it("Verificar que agrega con POST /api/v1/departamentos", async () => {
    const depto = { dept_no: "d999", dept_name: "Depto nueve nueve nueve" };
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(depto);

    //verificar que un objeto obtenido de la api conicide con el agregado
    const responseGET = await request(app).get("/api/v1/departamentos/d999");
    expect(responseGET).toBeDefined();
    expect(responseGET.statusCode).toBe(200);
    expect(responseGET.body).toStrictEqual(depto);

    // luego eliminar
    const responseDelete = await request(app)
      .delete("/api/v1/departamentos/d999")
      .send();
    expect(responseDelete).toBeDefined();
    expect(responseDelete.statusCode).toBe(204);
  });

  it("Verificar que modifica con PUT /api/v1/departamentos", async () => {
    const depto = { dept_no: "d999", dept_name: "Depto nueve nueve nueve" };
    //Primero Agregamos
    const response = await request(app)
      .post("/api/v1/departamentos")
      .send(depto);
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(depto);

    //Ahora modificamos con PUT
    const deptoCopia = { ...depto }; //clonamos el objeto
    deptoCopia.dept_no = "este código no lo tiene en cuenta";
    deptoCopia.atributoAdicional =
      "a este atributo adicional tampoco lo tiene en cuenta";
    deptoCopia.dept_name = "Departamento 999"; //modifica el nombre del departamento
    const responseUpdate = await request(app)
      .put("/api/v1/departamentos/d999") // en la url debe ir la clave
      .send(deptoCopia); //enviamos la copia
    expect(responseUpdate).toBeDefined();
    expect(responseUpdate.statusCode).toBe(200);
    const deptoCopiaVerificar = { ...depto }; //clonamos el objeto
    deptoCopiaVerificar.dept_name = "Departamento 999"; //modifica el nombre del departamento
    expect(responseUpdate.body).toStrictEqual(deptoCopiaVerificar); //verificamos con la copia para verificar

    //verificar que un objeto obtenido de la api conicide con el agregado y luego modificado
    const responseGET = await request(app).get("/api/v1/departamentos/d999");
    expect(responseGET).toBeDefined();
    expect(responseGET.statusCode).toBe(200);
    expect(responseGET.body).toStrictEqual(deptoCopiaVerificar); //verificamos con la copia para verificar

    // luego eliminar
    const responseDelete = await request(app)
      .delete("/api/v1/departamentos/d999")
      .send();
    expect(responseDelete).toBeDefined();
    expect(responseDelete.statusCode).toBe(204);
  });
});





describe('Pruebas para mover un empleado a otro departamento', () => {
  // 1. Comprobar que exista el empleado.
  it('Debería obtener un error si se proporciona un emp_no no válido', async () => {
    const response = await request(app).post('/api/v1/mover-empleado')
      .send({ emp_no: 'invalid_emp_no', dept_no_destino: 'nuevo_dept_no' }); // Reemplazar con un emp_no inválido y dept_no válido
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400); // Código de estado para datos incorrectos
    expect(response.text).toBe('Empleado no encontrado'); // Mensaje de error esperado
  });

  // 2. Comprobar que exista el departamento destino.
  it('Debería obtener un error si se proporciona un dept_no destino no válido', async () => {
    const response = await request(app).post('/api/v1/mover-empleado')
      .send({ emp_no: '10010', dept_no_destino: 'invalid_dept_no' }); // Reemplazar con un dept_no inválido y emp_no válido
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400); // Código de estado para datos incorrectos
    expect(response.text).toBe('Departamento destino no encontrado'); // Mensaje de error esperado
  });

  // 3. Comprobar que el departamento destino sea distinto al departamento actual del empleado.
  it('Debería obtener un error si el dept_no destino es igual al dept_no actual del empleado', async () => {
    const response = await request(app).post('/api/v1/mover-empleado')
      .send({ emp_no: '10010', dept_no_destino: 'd009' }); // Reemplazar con un dept_no igual al actual del empleado
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(400); // Código de estado para datos incorrectos
    expect(response.text).toBe('El departamento destino es igual al departamento actual del empleado'); // Mensaje de error esperado
  });

  // 4. Comprobar que los códigos de estado del protocolo HTTP en las respuestas sean correctos.
  it('Debería devolver el código de estado 200 si se realiza el movimiento correctamente', async () => {
    const response = await request(app).post('/api/v1/mover-empleado')
      .send({ emp_no: '10010', dept_no_destino: 'd006' }); // Reemplazar con un dept_no diferente al actual del empleado
    expect(response).toBeDefined();
    expect(response.statusCode).toBe(200); // Código de estado exitoso
  });

});

