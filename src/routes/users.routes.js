const { Router } = require("express"); // importando o Router de dentro do express

const UsersController = require("../controllers/UsersController");

const usersRoutes = Router(); // inicializando o Router

const usersController = new UsersController(); // instanciando (reservando um espaço em memória) a classe

usersRoutes.post("/", usersController.create);
usersRoutes.put("/:id", usersController.update);

module.exports = usersRoutes; // exportando as rotas para o server.js utilizar