import {createHash, timingSafeEqual} from 'node:crypto';
export {BOOK_TOKEN_HEADER} from '../../utils/bookAccess';

// Seule la lecture des textes accepte le jeton à la place d'une session
export function acceptsBookToken(method: string, path: string): boolean {
    return method === 'GET' && path.split('?')[0] === '/api/post';
}

const digest = (value: string) => createHash('sha256').update(value).digest();

export function hasValidBookToken(provided: string | undefined, expected: string | undefined): boolean {
    if (!provided || !expected) {
        return false;
    }
    // Comparaison à temps constant (sur des empreintes de même longueur)
    return timingSafeEqual(digest(provided), digest(expected));
}
