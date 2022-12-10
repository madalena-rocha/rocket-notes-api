require("express-async-errors"); // esta importação precisa ser feita no início de tudo
require("dotenv/config"); // para lidar com dados sensíveis

const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const cors = require("cors"); // para conectar o front com o back-end
// cors: Cross-origin resource sharing ou compartilhamento de recursos com origens diferentes
const express = require("express"); // importando o express
const routes = require("./routes");
// não é necessário colocar "./routes/index.js" pois, por padrão, quando não é informado o nome do arquivo que deseja acessar da pasta, carrega o arquivo index

migrationsRun(); // executando o banco de dados

const app = express(); // inicializando o express
app.use(cors()); // habilitar para que o back-end consiga atender as requisições do front-end
app.use(express.json());
// informando ao node que o conteúdo vindo pelo corpo da requisição é no formato JSON

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER)); // static para servir arquivos estáticos

app.use(routes);

// Tratar exceções para quando a aplicação der um erro identificar de onde está vindo (client ou server)
app.use(( error, request, response, next ) => {
    if (error instanceof AppError) { // saber se é um erro gerado pelo lado do cliente
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error(error);

    return response.status(500).json({ // erro padrão (erro do servidor)
        status: "error",
        message: "Internal server error"
    });
});

app.get("/", (req, res) => {
    return res.json({"message": "OK"});
})

const PORT = process.env.PORT || 3333; // informando a porta que o express deve atender as solicitações
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`)); // passando a função que será executada quando a aplicação iniciar

/*
    Ao clicar no Send no Insomnia, vem para o server.js, que está dizendo para a aplicação usar as rotas (app.use(routes))
    que estão no index.js (routes.use("/users", usersRouter)), achando a rota /users, levando para o arquivo usersRouter
    que está no users.routes.js onde estão as rotas do usuário, mostrando que é na raiz que deve aparecer (usersRoutes.post("/", (request, response) => {}))
*/