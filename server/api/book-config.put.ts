import BookConfig from "~/server/models/bookConfig";

export default defineEventHandler(async (event) => {
    await requireUserSession(event);

    const body = await readBody(event);

    await BookConfig.upsert({
        id: 1,
        ...body,
    });

    return await BookConfig.findOne();
});
