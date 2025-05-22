import Attachment from "~/server/models/attachment";

export default defineEventHandler(async () => {
    return await Attachment.findAll();
});
