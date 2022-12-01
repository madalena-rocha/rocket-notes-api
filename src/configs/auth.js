// Configurações de autenticação da aplicação

module.exports = {
    jwt: {
        secret: "default", // utilizado para gerar o token
        expiresIn: "1d" // tempo de expiração
    }
}
