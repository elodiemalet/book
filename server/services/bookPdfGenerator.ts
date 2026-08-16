import puppeteer from 'puppeteer';
import {PDFDocument} from 'pdf-lib';

export async function generatePdfFromEvent(token: string, protocol: string, host: string) {

    const url = `${protocol}://${host}/book?token=${token}`;

    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    let pdfBuffer: Uint8Array;
    let expectedPages: number;
    try {
        const page = await browser.newPage();
        await page.emulateMediaType('print');
        await page.goto(url, {waitUntil: 'networkidle0'});

        expectedPages = await page.$$eval('.page', (els) => els.length);

        pdfBuffer = await page.pdf({
            printBackground: true,
            preferCSSPageSize: true
        });
    } finally {
        await browser.close();
    }

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    while (totalPages > expectedPages && pdfDoc.getPageCount() > expectedPages) {
        pdfDoc.removePage(pdfDoc.getPageCount() - 1);
    }

    const finalPdf = await pdfDoc.save();
    return Buffer.from(finalPdf);
}
