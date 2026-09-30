// Le contenu d'un texte est stocké ligne par ligne (séparateur « \n »), avec
// éventuellement du HTML en ligne (<strong>, <em>…). Le livre le découpe sur
// « \n » : une ligne vide sépare deux strophes.
// L'éditeur TipTap, lui, lit du HTML : les « \n » y sont des espaces et
// disparaissent. On convertit donc à l'entrée et à la sortie de l'éditeur.

const BLOCK_HTML = /^\s*<(p|h[1-6])[\s>]/i;

/** Texte stocké → HTML de l'éditeur : une ligne = un paragraphe. */
export function textToEditorHtml(text: string): string {
    if (!text) {
        return '';
    }
    // Contenu déjà enregistré en HTML de blocs (anciennes sauvegardes)
    if (BLOCK_HTML.test(text)) {
        return text;
    }
    return text
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((line) => `<p>${line}</p>`)
        .join('');
}

/** HTML de l'éditeur → texte stocké : un paragraphe = une ligne. */
export function editorHtmlToText(html: string): string {
    const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
    const lines: string[] = [];
    for (const block of Array.from(doc.body.children)) {
        const inner = block.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        // Paragraphe simple : on garde le contenu ; titre ou alignement : le bloc entier
        const keepBlock = block.tagName !== 'P' || block.attributes.length > 0;
        if (keepBlock) {
            const clone = block.cloneNode(false) as Element;
            clone.innerHTML = block.innerHTML;
            lines.push(clone.outerHTML);
        } else {
            lines.push(inner);
        }
    }
    return lines.join('\n');
}
