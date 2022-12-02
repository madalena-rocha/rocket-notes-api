// Pegar a imagem dentro da pasta tmp e levá-la para a pasta uploads
// Colocar no banco de dados, no campo avatar, o endereço da imagem

const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
    async update(request, response) {
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        const diskStorage = new DiskStorage();

        const user = await knex("users")
            .where({ id: user_id }).first();
            // where({ user_id }) se o campo buscado fosse exatamente o mesmo campo do nome da constante usada como parâmetro da busca
    
        if (!user) {
            throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
        }

        if (user.avatar) {
            await diskStorage.deleteFile(user.avatar);
        }

        const filename = await diskStorage.saveFile(avatarFilename);
        user.avatar = filename;

        await knex("users").update(user).where({ id: user_id });

        return response.json(user);
    }
}

module.exports = UserAvatarController;