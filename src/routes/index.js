// O arquivo index.js vai reunir todas as rotas da aplicação

const { Router } = require("express");

const usersRouter = require("./users.routes");
const notesRouter = require("./notes.routes");
const tagsRouter = require("./tags.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router(); // o routes contém todas as rotas da aplicação
routes.use("/users", usersRouter);
// sempre que acessar o /user, será redirecionado para o usersRouter, que é o grupo de rotas do usuário
routes.use("/sessions", sessionsRouter);
routes.use("/notes", notesRouter);
// quando chamar pela /notes, será redirecionado para o notesRouter, 
// onde tem o método get que espera um parâmetro id e redireciona para o show dentro do notesController
routes.use("/tags", tagsRouter);

module.exports = routes;