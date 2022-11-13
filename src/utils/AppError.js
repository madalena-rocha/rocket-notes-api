// Tratar excessões (erros inesperados) para que não interfira no funcionamento da aplicação

class AppError {
    // Criar as variáveis no topo da classe faz com que toda a classe tome conhecimento delas, conseguindo acessá-las dentro de qualquer outra funcionalidade
    message;
    statusCode;

    // Toda classe tem um método construtor, que é carregado automaticamente quando a classe é instanciada
    constructor(message, statusCode = 400) { // toda vez que alguém for utilizar esta classe, saber do message e do statusCode
        // caso o statusCode não seja informado, o padrão é 400 (erro do cliente)
        this.message = message; // pegando a mensagem que chega pelo construtor da classe e repassando para o message que faz parte do contexto global
        this.statusCode = statusCode;
    }
}

module.exports = AppError;