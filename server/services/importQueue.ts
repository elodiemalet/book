import type {ImportResult} from "~/server/utils/importer/importFromJson";
import {importFromJson, importFromText} from "~/server/utils/importer/importFromJson";
import type {MultiPartData} from "h3";

export type ImportJobStatus = 'pending' | 'processing' | 'done' | 'error';

export interface ImportJob {
    id: string;
    fileName: string;
    status: ImportJobStatus;
    result: ImportResult | null;
    errorMessage: string;
    createdAt: number;
}

const jobs = new Map<string, ImportJob>();

const JOB_TTL = 60 * 60 * 1000; // 1 hour

let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
    if (cleanupInterval) return;
    cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [id, job] of jobs) {
            if ((job.status === 'done' || job.status === 'error') && now - job.createdAt > JOB_TTL) {
                jobs.delete(id);
            }
        }
    }, 5 * 60 * 1000); // check every 5 minutes
}

export function createJob(id: string, fileName: string): ImportJob {
    ensureCleanup();
    const job: ImportJob = {
        id,
        fileName,
        status: 'pending',
        result: null,
        errorMessage: '',
        createdAt: Date.now(),
    };
    jobs.set(id, job);
    return job;
}

const statusOrder: Record<ImportJobStatus, number> = {
    processing: 0,
    pending: 1,
    error: 2,
    done: 3,
};

export function getJobs(): ImportJob[] {
    return Array.from(jobs.values()).sort((a, b) => {
        const orderDiff = statusOrder[a.status] - statusOrder[b.status];
        if (orderDiff !== 0) return orderDiff;
        return a.createdAt - b.createdAt;
    });
}

export async function processJob(job: ImportJob, file: MultiPartData): Promise<void> {
    job.status = 'processing';

    try {
        const fileExtension = job.fileName.split('.').pop() || '';
        let results: ImportResult[];

        if (fileExtension === 'json') {
            results = await importFromJson({data: [file]});
        } else {
            results = await importFromText({data: [file]});
        }

        const merged = results.reduce<ImportResult>(
            (acc, curr) => ({
                posts: {
                    success: acc.posts.success + curr.posts.success,
                    error: acc.posts.error + curr.posts.error,
                    total: acc.posts.total + curr.posts.total,
                }
            }),
            {posts: {success: 0, error: 0, total: 0}}
        );

        job.result = merged;

        if (merged.posts.success === 0) {
            job.status = 'error';
            job.errorMessage = 'Aucun contenu importé';
        } else {
            job.status = 'done';
        }
    } catch (e: unknown) {
        job.status = 'error';
        job.errorMessage = e instanceof Error ? e.message : 'Erreur inconnue';
    }
}
