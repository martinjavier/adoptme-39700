import chai from "chai";
import { createHash, passwordValidation } from "../src/utils/index.js";
import UserDTO from "../src/dto/User.dto.js";

const expect = chai.expect;

describe("test para autenticacion y users dto",()=>{

    it("El servicio debe realizar un hasheo efectivo de la contraseña (debe corroborarse que el resultado sea diferente a la contraseña original",async function(){
        const passwordLogin = "1234";
        const efectiveHash = /(?=[A-Za-z0-9@#$%/^.,{}&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g;
        const passwordHash = await createHash(passwordLogin);
        // console.log("passwordHash",passwordHash);
        expect(efectiveHash.test(passwordHash)).to.be.equal(true);
    });

    it("El hasheo realizado debe poder compararse de manera efectiva con la contraseña original (la comparación debe resultar en true)", async function(){
        const passwordLogin = "1234";
        const passwordHash = await createHash(passwordLogin);
        const mockUser = {
            email:"pepe@gmail.com",
            password:passwordHash
        };
        const result = await passwordValidation(mockUser,passwordLogin);
        expect(result).to.be.equal(true);
    });

    it("Si la contraseña hasheada se altera, debe fallar en la comparación de la contraseña original.", async function(){
        const passwordLogin = "1234";
        const passwordHash = await createHash(passwordLogin);
        const mockUser = {
            email:"pepe@gmail.com",
            password:passwordHash+"ga786"
        };
        const result = await passwordValidation(mockUser,passwordLogin);
        expect(result).to.be.equal(false);
    });

    it("Por parte del DTO de usuario: Corroborar que el DTO unifique el nombre y apellido en una única propiedad. (Recuerda que puedes evaluar múltiples expects)", async function(){
        const userDB = {
            _id: "ObjectId(gjahsgd812763asdjhas)",
            first_name:"pepe",
            last_name:"perez",
            email:"pepe@gmail.com",
            password:"1234",
            role:"user",
            pets:[]
        };
        const result = UserDTO.getUserTokenFrom(userDB);
        expect(result.name).to.be.equal(`${userDB.first_name} ${userDB.last_name}`);
    });
});