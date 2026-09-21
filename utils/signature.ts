/**
 * Signature affichée sous un poème, identique dans l'aperçu, la page poème et le PDF :
 * « J.D. le lundi 1er mars 2021 ».
 */
export function formatSignature(author: string, date: Date): string {
    const dayNumber = date.getDate();
    const monthLong = new Intl.DateTimeFormat('fr-FR', {month: 'long'}).format(date);
    const weekdayLong = new Intl.DateTimeFormat('fr-FR', {weekday: 'long'}).format(date);
    const day = dayNumber === 1 ? '1er' : dayNumber;

    return `${author} le ${weekdayLong} ${day} ${monthLong} ${date.getFullYear()}`;
}
