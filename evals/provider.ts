// Provider promptfoo : fait passer un fichier par le vrai pipeline d'import
// (Pandoc → nettoyage → IA → retrait des lignes auteur/date) et renvoie le post obtenu.
import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';
import {extractPostFromFile} from '../server/services/postExtractor';

// promptfoo ne charge que .env ; les clés privées (GEMINI_API_KEY…) sont dans .env.local, qui a priorité
const localEnvPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(localEnvPath)) {
    Object.assign(process.env, parseEnv(fs.readFileSync(localEnvPath, 'utf8')));
}

interface ProviderContext {
    vars?: Record<string, unknown>;
}

export default class ImportPipelineProvider {
    id(): string {
        return `import:${process.env.GEMINI_API_KEY ? process.env.GEMINI_MODEL : process.env.AI_MODEL}`;
    }

    async callApi(prompt: string, context?: ProviderContext) {
        const file = String(context?.vars?.file ?? prompt);
        const extension = file.split('.').pop() || '';
        try {
            const buffer = fs.readFileSync(path.resolve(process.cwd(), file));
            return {output: await extractPostFromFile(buffer, extension)};
        } catch (e) {
            return {error: e instanceof Error ? e.message : String(e)};
        }
    }
}
