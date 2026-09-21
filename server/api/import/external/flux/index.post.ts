import {FluxImporter} from "~/server/services/fluxImporter";

export default defineEventHandler(async (event) => {
    await requireUserSession(event);
    const body = await readBody(event);

    const url = body.url;

    const contents = await new FluxImporter(url).import();

    return {
        contents
    };
});
