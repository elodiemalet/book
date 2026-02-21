import puppeteer from 'puppeteer';

export async function generatePdfFromEvent(token: string, protocol: string, host: string) {

    const url = `${protocol}://${host}/book?token=${token}`;

    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.emulateMediaType('print');
    await page.goto(url, {waitUntil: 'networkidle0'});

    const pdfBuffer = await page.pdf({
        printBackground: true,
        preferCSSPageSize: true
    });

    await browser.close();

    return pdfBuffer;
}
