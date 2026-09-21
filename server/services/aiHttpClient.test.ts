import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {AiHttpClient} from './aiHttpClient';

const okResponse = {choices: [{message: {content: '{}'}}]};

describe('AiHttpClient', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(okResponse)));
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it('calls the Gemini OpenAI-compatible endpoint when GEMINI_API_KEY is set', async () => {
        vi.stubEnv('GEMINI_API_KEY', 'test-key');
        vi.stubEnv('GEMINI_MODEL', 'gemini-3.1-flash-lite');
        vi.stubEnv('AI_API_URL', 'http://host.docker.internal:11434/');
        vi.stubEnv('AI_MODEL', 'llama3.2-vision');

        await new AiHttpClient().getDocumentInformation('texte');

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions');
        expect(init.headers.Authorization).toBe('Bearer test-key');
        expect(JSON.parse(init.body).model).toBe('gemini-3.1-flash-lite');
    });

    it('falls back to AI_API_URL / AI_MODEL without auth when GEMINI_API_KEY is not set', async () => {
        vi.stubEnv('GEMINI_API_KEY', '');
        vi.stubEnv('AI_API_URL', 'http://host.docker.internal:11434/');
        vi.stubEnv('AI_MODEL', 'llama3.2-vision');

        await new AiHttpClient().getDocumentInformation('texte');

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe('http://host.docker.internal:11434/v1/chat/completions');
        expect(init.headers.Authorization).toBeUndefined();
        expect(JSON.parse(init.body).model).toBe('llama3.2-vision');
    });
});
