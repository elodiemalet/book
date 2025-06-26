import Attachment from "~/server/models/attachment";

export default defineEventHandler(async (event) => {
    //@todo : access control from front only
    return await Attachment.findAll();
});
