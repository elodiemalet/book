import {setHeader} from "h3";
import {generatePdfFromEvent} from "~/server/services/bookPdfGenerator";

export default defineEventHandler(async (event/**/) => {
    await requireUserSession(event);

    const protocol: string = event.node.req.headers?.forwarded || 'http';
    const host = event.node.req.headers?.host || 'localhost';

    try {
        const token = useRuntimeConfig().pdfApiToken;
        const pdfBuffer = await generatePdfFromEvent(token, protocol, host);
        const fileName = `book.pdf`;

        // Set response headers for download
        setHeader(event, 'Content-Type', 'application/pdf');
        setHeader(event, 'Content-Disposition', `attachment; filename="${fileName}"`);

        return pdfBuffer;
    } catch {
        throw createError({
            statusCode: 500,
            statusMessage: 'Error generating PDF',
        });
    }

});
