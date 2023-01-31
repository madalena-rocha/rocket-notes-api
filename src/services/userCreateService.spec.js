const UserCreateService = require('./UserCreateService');
const UserRepositoryInMemory = require('../repositories/UserRepositoryInMemory');
const AppError = require("../utils/AppError");

// describe para agrupar testes por assunto
describe("UserCreateService", () => {
    let userRepositoryInMemory = null;
    let userCreateService = null;
    
    beforeEach(() => { // executado antes de cada teste
        userRepositoryInMemory = new UserRepositoryInMemory();
        userCreateService = new UserCreateService(userRepositoryInMemory);
    });

    // o it é uma função que recebe dois parâmetros, o primeiro é a descrição do teste, e o segundo é a função que vai executar o teste
    it("user should be create", async () => { // verificar se o usuário é criado com sucesso
        const user = {
            name: "User Test",
            email: "user@test.com",
            password: "123"
        };

        const userCreated = await userCreateService.execute(user);
        expect(userCreated).toHaveProperty("id");
        // expectativa de que dentro do userCreated tenha uma propriedade de id
    });

    it("user not should be create with exists email", async () => {
        const user1 = {
            name: "User Test 1",
            email: "user@test.com",
            password: "123"
        };

        const user2 = {
            name: "User Test 2",
            email: "user@test.com",
            password: "456"
        };

        await userCreateService.execute(user1);
        await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Este e-mail já está em uso."));
    });
});