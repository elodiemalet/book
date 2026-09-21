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

    describe('when the AI service is overloaded', () => {
        const overloaded = () => new Response('{"error":{"code":503,"message":"high demand"}}', {status: 503});

        it('retries and returns the first successful response', async () => {
            fetchMock
                .mockResolvedValueOnce(overloaded())
                .mockResolvedValueOnce(new Response('', {status: 429}))
                .mockResolvedValueOnce(new Response(JSON.stringify(okResponse)));

            const response = await new AiHttpClient([0, 0, 0]).getDocumentInformation('texte');

            expect(fetchMock).toHaveBeenCalledTimes(3);
            expect(response).toEqual(okResponse);
        });

        it('gives up after the last retry with a readable message', async () => {
            fetchMock.mockImplementation(async () => overloaded());

            await expect(new AiHttpClient([0, 0]).getDocumentInformation('texte'))
                .rejects.toThrow('L’IA est surchargée (erreur 503), réessayez dans quelques minutes');
            expect(fetchMock).toHaveBeenCalledTimes(3);
        });

        it('does not retry a request the service rejects', async () => {
            fetchMock.mockResolvedValue(new Response('bad request', {status: 400}));

            await expect(new AiHttpClient([0, 0]).getDocumentInformation('texte'))
                .rejects.toThrow('AI API error 400: bad request');
            expect(fetchMock).toHaveBeenCalledTimes(1);
        });
    });
});
