const { Router } = require("express"); // importando o Router de dentro do express

const UsersController = require("../controllers/UsersController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router(); // inicializando o Router

const usersController = new UsersController(); // instanciando (reservando um espaço em memória) a classe

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
// dentro do middleware de autenticação, vai capturar o id do usuário que está dentro do token de autenticação, portanto, não é mais necessário passar o id na rota

module.exports = usersRoutes; // exportando as rotas para o server.js utilizar