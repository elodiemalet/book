import Part from "~/server/models/part";

// Public : le livre et la page d'accueil en ont besoin pour composer le sommaire
export default defineEventHandler(async () => {
    return await Part.findAll({order: [['position', 'ASC'], ['id', 'ASC']]});
});
