import Attachment from "~/server/models/attachment";
import fs from 'fs';

export default defineEventHandler(async (event) => {
    const files = await readMultipartFormData(event);
    const firstFile = files?.[0];
    const acceptedFileTypes = ['image/jpeg', 'image/png'];

    if (firstFile === undefined) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No file uploaded',
        })
    }

    const type = firstFile.type || '';
    if (!acceptedFileTypes.includes(type)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid file type',
        })
    }

    const sizeInBytes = (firstFile.data as Buffer).length

    const attachment = await Attachment.create({
        name: firstFile.name,
        size: sizeInBytes,
        type: type,
        url: 'uploads',
    });

})