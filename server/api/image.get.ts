import Attachment from "~/server/models/attachment";

export default defineEventHandler(async (event) => {
    return await Attachment.findAll();
})