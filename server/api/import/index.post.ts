import {importFromJson} from "~/server/utils/importer/importFromJson";

export default defineEventHandler(async (event) => {

    const files = await readMultipartFormData(event);
    const firstFile = files?.[0];
    const acceptedFileTypes = ['application/json'];

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

    const json = JSON.parse(firstFile.data.toString('utf8'));
    if (!json.length) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid file format',
        })
    }

    return await importFromJson({data: json});
});