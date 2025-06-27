import ApiToken from "~/server/models/apiToken";

export default defineEventHandler(async (event/**/) => {
    await requireUserSession(event);
    const data = await readBody(event);
    const id = data.id;

    await ApiToken.update({
        revoked: true,
        revokedAt: new Date(),
    }, {
        where: {
            id: id,
        },
    });

    return await ApiToken.findByPk(id);
});