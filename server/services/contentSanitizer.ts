import DOMPurify from "dompurify";
import {JSDOM} from "jsdom";

export function sanitizeContent(content: string) {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    return purify.sanitize(content, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'strong', 'em', 'ul', 'li', 'a', 'img', 'u', 's', 'br'],
        ALLOWED_ATTR: ['src', 'alt', 'title']
    });
}