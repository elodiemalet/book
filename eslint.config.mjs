// eslint.config.mjs
import {createConfigForNuxt} from '@nuxt/eslint-config'

export default createConfigForNuxt({
    rules: {
        // Indentation dans les <template> Vue
        'vue/html-indent': ['error', 4, {
            attribute: 1,
            baseIndent: 1,
            closeBracket: 0,
            alignAttributesVertically: false,
            ignores: []
        }],

        // Indentation générale JS
        'indent': ['error', 4, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            MemberExpression: 1,
            FunctionDeclaration: {parameters: 'first'},
            FunctionExpression: {parameters: 'first'},
            CallExpression: {arguments: 'first'},
            ignoredNodes: ['TemplateLiteral'],
            // ignore indent for HTML attributes
        }],

        // Point-virgule obligatoire en JS
        'semi': ['error', 'always'],

        // Forcer l'utilisation de PascalCase pour les noms de composants dans les templates
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            registeredComponentsOnly: false,
            ignores: []
        }],

        '@typescript-eslint/no-explicit-any': 'off',

        'no-multiple-empty-lines': ['error', {
            max: 1,      // max 1 ligne vide consécutive
            maxEOF: 0,   // pas de ligne vide à la fin
            maxBOF: 0    // pas de ligne vide au début
        }],
        // 2. Fin de fichier : pas de saut de ligne en trop (ou en ajouter 1 si tu préfères 'always')
        'eol-last': ['error', 'always'],
    },
});
