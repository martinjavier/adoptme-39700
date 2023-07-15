import chai from "chai";
import supertest from "supertest";
import petModel from "../src/dao/models/Pet.js";
import userModel from "../src/dao/models/User.js";
import {app} from "../src/app.js";

const expect = chai.expect;
const requester = supertest(app);
const userTest = "pedro@gmail.com";

describe("Testing de App adoptme",()=>{

    describe("Test el modulo de mascotas",()=>{

        beforeEach(async function(){
            await petModel.deleteMany({});
        });

        it("El endpoint post /api/pets crea una mascota correctamente",async function(){
            const petMock={
                name:"Pelusa",
                specie:"Gato",
                birthDate:"02-11-2020"
            };
            const result = await requester.post("/api/pets").send(petMock);
            console.log("result", result);
            const {statusCode,_body} = result;
            expect(statusCode).to.be.equal(200);
            expect(_body.status).to.be.equal("success");
        });

        it("Al crear una mascota sólo con los datos elementales. Se debe corroborar que la mascota creada cuente con una propiedad adopted : false",async function(){
            const petMock={
                name:"Pelusa",
                specie:"Gato",
                birthDate:"02-11-2020"
            };
            const response = await requester.post("/api/pets").send(petMock);
            expect(response.body.payload.adopted).to.be.equal(false);
        });

        it("Si se desea crear una mascota sin el campo nombre, el módulo debe responder con un status 400.", async function(){
            const petMock={
                specie:"Perro",
                birthDate:"02-11-2020"
            };
            const response = await requester.post("/api/pets").send(petMock);
            expect(response.statusCode).to.be.equal(400);
        });

        it("Al obtener a las mascotas con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo.", async function(){
            const response = await requester.get("/api/pets");
            expect(response.statusCode).to.be.equal(200);
            expect(response.body).to.haveOwnProperty("status");
            expect(Array.isArray(response.body.payload)).to.deep.equal(true);
        });
    });

    describe("Test avazando-flujo autenticacion de un usuario", ()=>{
        before(async function(){
            this.cookie;
            await userModel.deleteMany({});
        });

        it("Se debe registrar al usuario correctamente",async function(){
            const mockUser = {
                first_name:"juan",
                last_name:"perez",
                email:userTest,
                password:"1234"
            };
            const responseSignup = await requester.post("/api/sessions/register").send(mockUser);
            expect(responseSignup.statusCode).to.be.equal(200);
        });

        it("Debe loguear al usuario y devolver una cookie",async function(){
            const mockUserLogin={
                email:userTest,
                password:"1234"
            };
            const responseLogin = await requester.post("/api/sessions/login").send(mockUserLogin);
            //cons supertest obtenemos los headers de la respuesta, y extraer el header [set-cookie]
            // console.log("responseLogin",responseLogin)
            const cookieResponse = responseLogin.headers["set-cookie"][0];
            // console.log("cookieResponse",cookieResponse);
            const cookieData={
                name:cookieResponse.split("=")[0],
                value: cookieResponse.split("=")[1]
            }
            // console.log("cookie", cookieData.name);
            this.cookie = cookieData;
            expect(this.cookie.name).to.be.equal("coderCookie");
        });

        it("Al llamar /current obtenemos la cookie y la informacion del usuario",async function(){
            const currentResponse = await requester.get("/api/sessions/current").set("Cookie",[`${this.cookie.name}=${this.cookie.value}`]);
            // console.log("currentResponse",currentResponse);
            expect(currentResponse.body.payload.email).to.be.equal(userTest);
        });
    });

    describe("test upload image", ()=>{
        beforeEach(async function(){
            await petModel.deleteMany({});
        });

        it("Debe poder crearse una mascota con la ruta de la imagen", async function(){
            const petMock={
                name:"Pelusa",
                specie:"Gato",
                birthDate:"02-11-2020"
            };
            const response = await requester.post("/api/pets/withimage")
            .field("name", petMock.name)
            .field("specie", petMock.specie)
            .field("birthDate", petMock.birthDate)
            .attach("image", "./test/images/gato.jpg");
            // console.log("response",response);
            expect(response.statusCode).to.be.equal(200);
            expect(response.body.payload.image).to.be.ok;
        });
    });

});