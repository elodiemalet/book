import nodemailer from 'nodemailer';
import {generatePdfFromEvent} from "~/server/services/bookPdfGenerator";
import {createSSRApp} from "vue";
import EmailTemplate from "~/components/email/EmailTemplate.vue";
import {renderToString} from "vue/server-renderer";
import {readFileSync} from "node:fs";

const localTransporter = nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
    secure: false,
});

export async function sendSiteMail({to}: { to: string; }) {
    const token = 'mon-token-perso';
    const protocol: string = 'http';
    const host = 'localhost:3000';

    const pdfBuffer = await generatePdfFromEvent(token, protocol, host);
    const buffer = Buffer.from(pdfBuffer.buffer);

    const dataUrl = getDataUrl('logo.png');
    const app = createSSRApp(EmailTemplate, {
        dataUrl,
    });

    const html = await renderToString(app);
    const css = readFileSync('./assets/styles/email.css', 'utf8');

    const pageHtml = `  
        <!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
                <style>${css}</style>
            </head>
            <body>${html}</body>
        </html>
    `;

    const mailOptions = {
        from: '"Ton Site" <no-reply@tonsite.com>',
        to,
        subject: 'Voici votre extrait gratuit ✨',
        text: `Bonjour cher lecteur, voici votre extrait...`,
        html: pageHtml,
        attachments: [
            {
                filename: 'book.pdf',
                contentType: 'application/pdf',
                content: buffer,
                contentDisposition: 'attachment',
            },
        ]
    };

    localTransporter.sendMail(mailOptions).then((result) => {
        console.log('Email envoyé avec succès');
        return result;
    }).catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'email', error);
        throw error;
    });
}

function getDataUrl(imageName: string) {
    const logoPath = './assets/images/' + imageName;
    const logoBuffer = readFileSync(logoPath);

    // 2. Convert to Base64 and build a data URL:
    const base64 = logoBuffer.toString('base64');
    return `data:image/png;base64,${base64}`;
}
