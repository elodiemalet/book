import Prospect from "~/server/models/prospect";
import {z} from "zod";

const bodySchema = z.object({
    email: z.string().email(),
});

export default defineEventHandler(async (event) => {
    const {email} = await readValidatedBody(event, bodySchema.parse);

    await Prospect.create({
        email,
    }).catch((error) => {
        throw createError({
            statusCode: error.code,
            statusMessage: error.name,
        });
    });

    return;
});
