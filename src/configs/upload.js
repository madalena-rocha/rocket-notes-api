const path = require("path");
const multer = require("multer"); // biblioteca utilizada para fazer o upload
const crypto = require("crypto");

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp"); // pasta onde a imagem chega
// __dirname para pegar a pasta atual, .. para sair dessa pasta, .. para sair da pasta src e entrar na pasta tmp na raiz do projeto
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER,  "uploads"); // pasta onde a imagem vai ficar

const MULTER = {
    // recebe duas propriedades, para onde será mandado o arquivo quando for carregado na aplicação, e o nome do arquivo
    storage: multer.diskStorage({
        destination: TMP_FOLDER,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString("hex");
            // utilizar o crypto para gerar um hash de forma aleatória com 10 caracteres no formato hexadecimal
            const fileName = `${fileHash}-${file.originalname}`;
            // criar um nome para o arquivo utilizando o hash para evitar arquivos com nomes iguais
        
            return callback(null, fileName);
        },
    }),
};

module.exports = {
    TMP_FOLDER,
    UPLOADS_FOLDER,
    MULTER,
}