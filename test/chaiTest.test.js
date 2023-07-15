import mongoose from "mongoose";
import Users from "../src/dao/Users.dao.js";
import userModel from "../src/dao/models/User.js";
import chai from "chai";

const expect = chai.expect;

describe("Testing para la clase Users dao",()=>{
    before(async function(){
        await mongoose.connect("mongodb+srv://fredy:coder@coderbackend.d0kaklh.mongodb.net/petsDBPruebas?retryWrites=true&w=majority");
        this.usersDao = new Users();
    });

    beforeEach(async function(){
        await userModel.deleteMany();
    });

    after(async function(){
        await mongoose.connection.close();
    });

    it("El metodo get de la clase Users debe obtener los usuarios en formato de arreglo",async function(){
        const result = await this.usersDao.get();
        // console.log(result);
        expect(result).to.be.deep.equal([]);
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
        // expect(result._id).to.be.ok;
        expect(result).to.have.property("_id");
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
        expect(userDB.pets).to.be.deep.equal([]);
    });

    it("el dao puede actualizar un usuario por id",async function(){
        let mockUser = {
            first_name:"pepe",
            last_name:"perez",
            email:"pepe@gmail.com",
            password:"1234"
        };
        const result = await this.usersDao.save(mockUser);
        const userDB = await this.usersDao.getBy({email:result.email});
        userDB.first_name="pepe modificado";
        const userUpdate = await this.usersDao.update(userDB._id,userDB);
        expect(userUpdate.first_name).to.be.equal("pepe modificado");
    });
});