import {setHeader} from "h3";
import puppeteer from "puppeteer";

export default defineEventHandler(async (event/**/) => {
    const protocol = event.node.req.headers?.['x-forwarded-proto'] || 'http';
    const host = event.node.req.headers?.host
    const body = await readBody(event)

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const token = body.token || 'montoken';

        const url = `${protocol}://${host}/book?token=${token}`;

        await page.goto(url, {waitUntil: 'networkidle0'});

        // Generate the PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
        });

        await browser.close();

        // Set response headers for download
        setHeader(event, 'Content-Type', 'application/pdf');
        setHeader(event, 'Content-Disposition', 'attachment; filename="test.pdf"');
        console.log('PDF generated successfully');

        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF:', error);
    }

});
