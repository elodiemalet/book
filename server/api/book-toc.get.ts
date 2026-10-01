import BookConfig from "~/server/models/bookConfig";
import Part from "~/server/models/part";
import Post from "~/server/models/post";
import {tocParts} from "~/utils/bookToc";

// Public : le sommaire de la page d'accueil (titres et numéros des parties), sans rien lire du contenu des textes
export default defineEventHandler(async () => {
    const config = await BookConfig.findOne();
    if (!config?.get('showToc')) {
        return [];
    }

    const [posts, parts] = await Promise.all([
        Post.findAll({attributes: ['partId'], raw: true}),
        Part.findAll({attributes: ['id', 'title'], order: [['position', 'ASC'], ['id', 'ASC']], raw: true}),
    ]);
    return tocParts(posts, parts);
});
