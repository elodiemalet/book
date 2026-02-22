import {getJobs} from "~/server/services/importQueue";

export default defineEventHandler(async (event) => {
    await requireUserSession(event);

    return {jobs: getJobs()};
});
