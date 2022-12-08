// Configurações de autenticação da aplicação

module.exports = {
    jwt: {
        secret: process.env.AUTH_SECRET || "default", // utilizado para gerar o token
        // caso não encontre a variável de ambiente, utilizar o default
        expiresIn: "1d" // tempo de expiração
    }
}
