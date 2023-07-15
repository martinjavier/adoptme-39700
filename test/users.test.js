import mongoose from "mongoose";
import Users from "../src/dao/Users.dao.js";
import Assert from "assert";
import userModel from "../src/dao/models/User.js";

const assert = Assert.strict;

//generar el contexto describe de la clase Users dao
describe("Testing para la clase Users dao",()=>{

    before(async function(){
        await mongoose.connect("mongodb+srv://fredy:coder@coderbackend.d0kaklh.mongodb.net/petsDBPruebas?retryWrites=true&w=majority");
        this.usersDao = new Users();
    });

    beforeEach(async function(){
        await userModel.deleteMany();
    });

    it("El metodo get de la clase Users debe obtener los usuarios en formato de arreglo",async function(){
        const result = await this.usersDao.get();
        // console.log(result);
        assert.strictEqual(Array.isArray(result),true);
    });

    it("El dao debe agregar un usuario correctamente en la base de datos", async function(){
        let mockUser = {
            first_name:"pepe",
            last_name:"perez",
            email:"pepe@gmail.com",
            password:"1234"
        };
        const result = await this.usersDao.save(mockUser);
        // console.log("result",result);
        assert.ok(result._id);
    });

    it("Al agregar un nuevo usuario, éste debe crearse con un arreglo de mascotas vacío por defecto",async function(){
        let mockUser = {
            first_name:"pepe",
            last_name:"perez",
            email:"pepe@gmail.com",
            password:"1234"
        };
        const result = await this.usersDao.save(mockUser);
        const userDB = await this.usersDao.getBy({email:result.email});
        // console.log("userDB",userDB);
        assert.strictEqual(Array.isArray(userDB.pets),true);
    });
});