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