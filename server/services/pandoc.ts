import fs from 'fs';
import {promisify} from 'util';
import {execFile as _execFile} from 'child_process';
import tmp from 'tmp';

const execFile = promisify(_execFile);
const unlink = promisify(fs.unlink);

// Filtre Lua : supprime images et figures (avec leurs légendes), garde seulement le texte des liens
const STRIP_MEDIA_FILTER = `
function Image() return {} end
function Figure() return {} end
function Link(el) return el.content end
`;

export async function extractWithPandoc(file: Buffer, fromFormat: string): Promise<string> {
    // 1. On crée deux fichiers temporaires : l'ODT d'entrée et le MD intermédiaire
    const tmpIn = tmp.fileSync({postfix: `.${fromFormat}`});
    const tmpMd = tmp.fileSync({postfix: `.md`});
    const tmpFilter = tmp.fileSync({postfix: `.lua`});
    const inPath = tmpIn.name;
    const mdPath = tmpMd.name;
    const filterPath = tmpFilter.name;

    try {
        // 2. On écrit le buffer ODT et le filtre Lua
        await fs.promises.writeFile(inPath, file);
        await fs.promises.writeFile(filterPath, STRIP_MEDIA_FILTER);

        // 3. Étape 1 : ODT → Markdown avec hard_line_breaks et wrap=preserve, sans images ni liens
        await execFile('pandoc', [
            `--from=${fromFormat}`,                 // ex. odt
            '--to=markdown+hard_line_breaks',
            `--lua-filter=${filterPath}`,
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
        // 5. Nettoyage : on supprime les fichiers temporaires
        for (const path of [inPath, mdPath, filterPath]) {
            try {
                await unlink(path)
            } catch (e) {
                console.warn(`rm ${path}:`, e)
            }
        }
    }
}
