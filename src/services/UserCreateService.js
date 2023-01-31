const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UserCreateService {
    constructor(userRepository) {
        // O método construtor é executado automaticamente no momento em que a classe é instanciada
        this.userRepository = userRepository;
        // pegando o parâmetro userRepository e atribuindo a uma variável de mesmo nome
        // this.usersRepository está compartilhando com a classe inteira o usersRepository
        // this para colocar no escopo global da classe
    }

    async execute({ name, email, password }) {
        // não é necessário instanciar o userRepository
        // recebe o userRepository como parâmetro no construtor da classe, ou seja, quando desejar usar o execute, que contém toda a regra de negócio, será necessário informar qual o userRepository, pois dentro da classe não é definido qual banco de dados utilizar

        const checkUserExists = await this.userRepository.findByEmail(email); // verificar se o e-mail do usuário já existe no banco de dados
        
        if (checkUserExists) {
            throw new AppError("Este e-mail já está em uso.");
        }

        const hashedPassword = await hash(password, 8); // o segundo parâmetro é o salt, que é o fator de complexidade do hash
        // a hash é uma promise, por isso, é necessário utilizar o await para esperar terminar de gerar a criptografia

        const userCreated = await this.userRepository.create({ name, email, password: hashedPassword });
        // inserir na tabela de usuários nas coluna name, email e password os valores recebidos do usuário
    
        return userCreated;
    }
}

module.exports = UserCreateService;