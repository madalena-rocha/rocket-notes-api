// Salvar o arquivo no storage do disco de onde o backend tiver hospedado
// Sempre que o usuário enviar uma nova foto, antes de salvá-la, é necessário verificar se o usuário já tem uma foto, deletar a foto antiga e colocar a nova, para não haver fotos duplicadas

const fs = require("fs"); // para lidar com manipulação de arquivos
const path = require("path"); // para lidar com os diretórios
const uploadConfig = require("../configs/upload");

class DiskStorage {
    async saveFile(file) {
        await fs.promises.rename(
            // rename permite renomear ou mover o arquivo, neste caso, está sendo utilizada para mudar o arquivo de lugar
            // promise porque mover o arquivo leva algum tempo, dependendo do tamanho do arquivo, por exemplo
            // await para que o JS entenda que é necessário esperar o processo terminar para executar o restante do código
            path.resolve(uploadConfig.TMP_FOLDER, file),
            // path.resolve resolve uma sequência de segmentos de caminho para um caminho absoluto
            path.resolve(uploadConfig.UPLOADS_FOLDER, file)
            // pegar o arquivo dentro da pasta temporária e levar para a pasta de uploads
        );

        return file;
    }

    async deleteFile(file) {
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file); // buscando pelo arquivo na pasta de uploads
    
        try {
            await fs.promises.stat(filePath);
            // stat retorna o status do arquivo, por exemplo, se o arquivo está aberto por outro processo, se está corrompido, se está disponível, etc.
        } catch { // se o arquivo não tiver disponível para mudar de lugar
            return;
        }

        await fs.promises.unlink(filePath); // unlink para remover o arquivo
    }
}

module.exports = DiskStorage;