const { Router } = require("express"); // importando o Router de dentro do express
const multer = require("multer"); // multer para carregar a imagem
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router(); // inicializando o Router
const upload = multer(uploadConfig.MULTER);

const usersController = new UsersController(); // instanciando (reservando um espaço em memória) a classe
const userAvatarController = new UserAvatarController();

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update); // put para atualizar vários campos
// dentro do middleware de autenticação, vai capturar o id do usuário que está dentro do token de autenticação, portanto, não é mais necessário passar o id na rota
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update) 
// patch para atualizar um campo específico, neste caso, o campo de avatar do usuário
// single porque vai carregar só um arquivo, recebe o nome do campo que vai trazer o arquivo
// não vai salvar o arquivo de imagem dentro do banco
// a imagem é guardada numa pasta e o banco de dados guarda a referência de onde a imagem está armazenada

module.exports = usersRoutes; // exportando as rotas para o server.js utilizar