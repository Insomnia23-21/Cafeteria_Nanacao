const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
  
  it("debería retornar un status code 200 y un arreglo con al menos un objeto", async () => {
    const response = await request(server).get("/cafes");
    expect(response.status).toBe(200); 
    expect(response.body).toBeInstanceOf(Array); 
    expect(response.body.length).toBeGreaterThan(0); 
    expect(response.body[0]).toMatchObject({ id: expect.any(Number), nombre: expect.any(String) }); 
  });

  it("debería retornar un status code 404 al eliminar un café con un id inexistente", async () => {
    const cafeIdInexistente = 999; 
    const response = await request(server).delete(`/cafes/${cafeIdInexistente}`).set("Authorization", "Bearer tokenValido");
    expect(response.status).toBe(404); 
    expect(response.body).toHaveProperty("message", "No se encontró ningún cafe con ese id"); 
  });

  it("debería agregar un nuevo café y devolver un status code 201", async () => {
    const nuevoCafe = { id: 5, nombre: "Latte" };
    const response = await request(server).post("/cafes").send(nuevoCafe);
    expect(response.status).toBe(201); 
    expect(response.body).toContainEqual(nuevoCafe); 
  });

  it("debería retornar un status code 400 si el id en los parámetros es diferente al id en el payload", async () => {
    const cafeActualizado = { id: 6, nombre: "Espresso" };
    const response = await request(server).put("/cafes/7").send(cafeActualizado); 
    expect(response.status).toBe(400); 
    expect(response.body).toHaveProperty("message", "El id del parámetro no coincide con el id del café recibido"); 
  });
});