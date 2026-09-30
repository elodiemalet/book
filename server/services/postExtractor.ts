import {AiHttpClient} from './aiHttpClient';
import {extractWithPandoc} from './pandoc';
import {cleanTextForAi, removeAuthorDateLines} from './textCleaner';

export interface ExtractedPost {
    postTitle: string;
    author: string;
    content: string;
    // Chaîne ISO renvoyée par l'IA ; Date accepté pour rester compatible avec PostInterface
    publishDate: string | Date;
}

/**
 * Fichier importé → post : Pandoc, nettoyage, extraction par l'IA, puis retrait des lignes auteur/date.
 * Utilisé par l'import et par les évals promptfoo (evals/), qui testent ainsi le vrai pipeline.
 */
export async function extractPostFromFile(file: Buffer, extension: string, aiApi = new AiHttpClient()): Promise<ExtractedPost> {
    const text = cleanTextForAi(await extractWithPandoc(file, extension));
    const documentInformation = await aiApi.getDocumentInformation(text);
    const raw = documentInformation.choices[0]?.message.content ?? '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        console.error('No JSON found in AI response:', raw);
        throw new Error('Réponse de l’IA illisible');
    }
    const post = JSON.parse(jsonMatch[0]);
    if (typeof post.content === 'string') {
        post.content = removeAuthorDateLines(post.content, post.author, post.publishDate);
    }
    return post;
}
