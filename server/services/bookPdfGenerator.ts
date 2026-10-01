import puppeteer from 'puppeteer';
import {PDFDocument} from 'pdf-lib';
import {bookRenderProblem} from './bookRenderCheck';

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

        // Un livre en échec ou sans texte ne s'imprime pas (sinon : un PDF réduit à la couverture)
        const render = await page.evaluate(() => ({
            pages: document.querySelectorAll('.page').length,
            texts: Number(document.querySelector('[data-book-texts]')?.getAttribute('data-book-texts') ?? 0),
            error: document.querySelector('[data-book-error]')?.getAttribute('data-book-error') ?? null,
        }));
        const problem = bookRenderProblem(render);
        if (problem) {
            throw new Error(`${problem} (${page.url().split('?')[0]})`);
        }
        expectedPages = render.pages;

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
