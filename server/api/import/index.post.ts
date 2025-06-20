import {importFromJson, importFromText} from "~/server/utils/importer/importFromJson";

interface ImportResult {
    posts: {
        success: number
        error: number
        total: number
    }
}

export default defineEventHandler(async (event) => {

    const files = await readMultipartFormData(event);
    const acceptedFileTypes = [
        'application/json',
        'text/csv',
        'text/plain',
        'text/html',
        'text/markdown',
        'application/vnd.oasis.opendocument.text',
        'application/msword',
    ];

    const firstFile = files?.[0];

    if (firstFile === undefined) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No file uploaded',
        });
    }

    const jsonFiles = [];
    const textFiles = [];
    for (const file of files) {

        const type = file.type || '';
        if (!acceptedFileTypes.includes(type) || !file.filename) {
            continue;
        }

        const fileExtension = file?.filename.split('.').pop() || '';
        if (fileExtension === 'json') {
            jsonFiles.push(file);
        } else {
            textFiles.push(file);
        }
    }


    const results = [];

    if (jsonFiles.length > 0) {
        const jsonResult = await importFromJson({data: jsonFiles});
        jsonResult.forEach(item => {
            console.log('item', item);
        });
        results.push(jsonResult);
    }

    if (textFiles.length > 0) {
        const textResult = await importFromText({data: textFiles});
        results.push(textResult);
    }

    if (results.length === 0) {
        return {
            result: {
                posts: {
                    success: 0,
                    error: 0,
                    total: 0,
                }
            }
        };
    }

    const mergedResult = results.slice(1).reduce<ImportResult>(
        (acc, curr) => ({
            posts: {
                success: acc.posts.success + curr.posts.success,
                error: acc.posts.error + curr.posts.error,
                total: acc.posts.total + curr.posts.total,
            }
        }),
        // point de départ : le premier élément
        results[0]
    )


    return {
        result: mergedResult,
    };
});
