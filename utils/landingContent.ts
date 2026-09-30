// Contenu éditorial de la page d'accueil (page de vente du livre).
// Le titre, l'auteur et la couverture viennent de la configuration du livre (bookStore).
// Les textes ci-dessous sont les valeurs par défaut. L'en-tête, l'auteur (photo comprise) et le pied de page
// se modifient dans l'admin (Configuration) et sont enregistrés en base (SiteConfigs) ; le reste se modifie ici.

export interface LandingTocItem {
    title: string;
    kind?: 'poème' | 'récit';
    page: number;
}

export interface LandingTocPart {
    title: string;
    items: LandingTocItem[];
}

export interface LandingOffer {
    id: string;
    name: string;
    format: string;
    price: number;
    description: string;
    features: string[];
    href: string;
    cta: string;
    featured?: boolean;
    badge?: string;
}

export interface LandingTestimonial {
    quote: string;
    name: string;
    role?: string;
    rating?: number;
}

export interface LandingContent {
    genre: string;
    pagesLabel: string;
    pitch: string;
    // Laisser à null tant qu'aucun avis réel n'est disponible : la section est alors masquée.
    testimonial: LandingTestimonial | null;
    toc: {
        heading: string;
        headingEmphasis: string;
        intro: string;
        parts: LandingTocPart[];
    };
    freeSample: {
        heading: string;
        headingEmphasis: string;
        intro: string;
        note: string;
    };
    author: {
        label: string;
        portraitUrl: string | null;
        bio: string[];
        link: { label: string; href: string } | null;
    };
    pricing: {
        heading: string;
        headingEmphasis: string;
        intro: string;
        offers: LandingOffer[];
    };
    footer: string;
}

export const landingContent: LandingContent = {
    genre: 'Recueil',
    pagesLabel: 'Poèmes et récits',
    pitch: 'Des poèmes et des récits courts, composés comme un vrai livre : à lire lentement, à voix basse, et à ouvrir n\'importe où.',
    testimonial: null,
    toc: {
        heading: 'Le sommaire,',
        headingEmphasis: 'partie par partie.',
        intro: 'Poèmes et récits se répondent d\'une partie à l\'autre. Chacun tient en quelques pages.',
        parts: [
            {
                title: 'Commencer',
                items: [
                    {title: 'Introduction au projet', page: 1},
                    {title: 'Présentation des objectifs', page: 5},
                    {title: 'Premiers éléments de contenu', page: 10},
                ],
            },
            {
                title: 'Fondamentaux',
                items: [
                    {title: 'Organisation du texte', page: 14},
                    {title: 'Structuration des idées', page: 18},
                    {title: 'Hiérarchisation de l\'information', page: 23},
                    {title: 'Rythme et fluidité de lecture', page: 28},
                ],
            },
            {
                title: 'Enrichir le contenu',
                items: [
                    {title: 'Ajout de visuels ou illustrations', page: 34},
                    {title: 'Séparer pour mieux raconter', page: 39},
                    {title: 'Créer des respirations dans le texte', page: 45},
                    {title: 'Personnaliser le ton', page: 52},
                ],
            },
            {
                title: 'Préparer la version finale',
                items: [
                    {title: 'Relire et ajuster', page: 58},
                    {title: 'Définir le sommaire', page: 64},
                    {title: 'Exporter votre e-book', page: 70},
                ],
            },
        ],
    },
    freeSample: {
        heading: 'Un extrait,',
        headingEmphasis: 'offert.',
        intro: 'Laissez votre adresse : vous recevrez par e-mail un extrait du livre en PDF, avec deux chapitres choisis.',
        note: 'Un seul e-mail, aucune inscription à une newsletter.',
    },
    author: {
        label: 'L\'auteur',
        // Image de repli, utilisée tant qu'aucune photo n'a été envoyée depuis Configuration.
        portraitUrl: '/images/avatars/author.png',
        // Vide par défaut : se renseigne dans Configuration.
        bio: [],
        link: null,
    },
    pricing: {
        heading: 'À l\'écran',
        headingEmphasis: 'ou sur papier.',
        intro: 'Le même livre, composé avec le même soin, en deux éditions.',
        offers: [
            {
                id: 'ebook',
                name: 'E-book',
                format: 'PDF',
                price: 5,
                description: 'Téléchargez la version numérique du livre.',
                features: [
                    'Téléchargement instantané',
                    'Sur tous vos appareils',
                    'Lecture sur écran',
                ],
                href: '#',
                cta: 'Acheter l\'e-book',
            },
            {
                id: 'print',
                name: 'Livre imprimé',
                format: 'Papier',
                price: 29,
                description: 'Recevez chez vous la version imprimée de l\'édition complète.',
                features: [
                    'Livraison à domicile',
                    'Confort de lecture papier',
                    'À feuilleter, annoter, conserver',
                    'À offrir, relire, ou ranger dans sa bibliothèque',
                ],
                href: '#',
                cta: 'Commander le livre',
                featured: true,
                badge: 'Édition complète',
            },
        ],
    },
    footer: '© 2025 Élodie Malet – Melodev. Tous droits réservés.',
};

type Loose = Record<string, unknown> | null | undefined;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const str = (value: unknown, fallback: string): string => typeof value === 'string' ? value : fallback;

const strList = (value: unknown, fallback: string[]): string[] => Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean)
    : fallback;

const section = (value: unknown): Record<string, unknown> => isObject(value) ? value : {};

function mergeLink(value: unknown, fallback: LandingContent['author']['link']): LandingContent['author']['link'] {
    if (value === null) {
        return null;
    }
    if (!isObject(value)) {
        return fallback;
    }
    const href = str(value.href, '').trim();
    return href ? {label: str(value.label, '').trim() || href, href} : null;
}

// Fusionne un contenu enregistré (éventuellement partiel ou ancien) avec les valeurs par défaut.
// Seuls l'en-tête, l'auteur (photo comprise) et le pied de page sont configurables ;
// le reste (sommaire, extrait gratuit, offres, avis) garde toujours la valeur par défaut.
export function mergeLandingContent(stored: Loose | unknown, defaults: LandingContent = landingContent): LandingContent {
    const data = section(stored);
    const author = section(data.author);

    return {
        ...defaults,
        genre: str(data.genre, defaults.genre),
        pagesLabel: str(data.pagesLabel, defaults.pagesLabel),
        pitch: str(data.pitch, defaults.pitch),
        author: {
            label: str(author.label, defaults.author.label),
            portraitUrl: str(author.portraitUrl, '').trim() || defaults.author.portraitUrl,
            bio: strList(author.bio, defaults.author.bio),
            link: 'link' in author ? mergeLink(author.link, defaults.author.link) : defaults.author.link,
        },
        footer: str(data.footer, defaults.footer),
    };
}
