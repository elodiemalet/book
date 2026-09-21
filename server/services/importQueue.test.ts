import {describe, expect, it, vi} from 'vitest';
import type {MultiPartData} from 'h3';
import {createJob, processJob} from './importQueue';
import {importFromText} from '~/server/utils/importer/importFromJson';

vi.mock('~/server/utils/importer/importFromJson', () => ({
    importFromJson: vi.fn(),
    importFromText: vi.fn(),
}));

const file = {filename: 'poeme.docx', data: Buffer.from('')} as MultiPartData;

describe('processJob', () => {
    it('affiche la raison de l’échec quand aucun contenu n’est importé', async () => {
        vi.mocked(importFromText).mockResolvedValue([{
            posts: {success: 0, error: 1, total: 1},
            errors: ['L’IA est surchargée (erreur 503), réessayez dans quelques minutes'],
        }]);
        const job = createJob('job-1', 'poeme.docx');

        await processJob(job, file);

        expect(job.status).toBe('error');
        expect(job.errorMessage).toBe('L’IA est surchargée (erreur 503), réessayez dans quelques minutes');
    });

    it('garde le message générique quand aucune raison n’est connue', async () => {
        vi.mocked(importFromText).mockResolvedValue([{posts: {success: 0, error: 0, total: 0}}]);
        const job = createJob('job-2', 'poeme.docx');

        await processJob(job, file);

        expect(job.errorMessage).toBe('Aucun contenu importé');
    });
});
