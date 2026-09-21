import fs from 'fs';
import {promisify} from 'util';
import {execFile as _execFile} from 'child_process';
import tmp from 'tmp';

const execFile = promisify(_execFile);
const unlink = promisify(fs.unlink);

export async function extractWithPandoc(file: Buffer, fromFormat: string): Promise<string> {
    // 1. On crée deux fichiers temporaires : l'ODT d'entrée et le MD intermédiaire
    const tmpIn = tmp.fileSync({postfix: `.${fromFormat}`});
    const tmpMd = tmp.fileSync({postfix: `.md`});
    const inPath = tmpIn.name;
    const mdPath = tmpMd.name;

    try {
        // 2. On écrit le buffer ODT
        await fs.promises.writeFile(inPath, file);

        // 3. Étape 1 : ODT → Markdown avec hard_line_breaks et wrap=preserve
        await execFile('pandoc', [
            `--from=${fromFormat}`,                 // ex. odt
            '--to=markdown+hard_line_breaks',
            '--wrap=preserve',
            '--columns=4096',
            inPath,
            '-o', mdPath
        ]);

        // 4. Étape 2 : Markdown → plain, wrap=preserve
        const {stdout, stderr} = await execFile('pandoc', [
            '--from=markdown+hard_line_breaks',
            '--to=plain',
            '--wrap=preserve',
            '--columns=4096',
            mdPath
        ]);

        if (stderr) {
            // on peut logguer ou retourner une chaîne vide selon votre besoin
            console.warn('pandoc stderr:', stderr);
            return '';
        }

        return stdout;
    } finally {
        // 5. Nettoyage : on supprime les deux fichiers
        try {
            await unlink(inPath)
        } catch (e) {
            console.warn(`rm ${inPath}:`, e)
        }
        try {
            await unlink(mdPath)
        } catch (e) {
            console.warn(`rm ${mdPath}:`, e)
        }
    }
}
