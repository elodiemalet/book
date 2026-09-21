import {createConfigForNuxt} from '@nuxt/eslint-config'

export default createConfigForNuxt({
    // Parser global pour JS/TS et Vue
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    // Règles globales JS/TS
    rules: {
        // Indentation générale JS à 4 espaces
        'indent': ['error', 4, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            MemberExpression: 1,
            FunctionDeclaration: {parameters: 'first'},
            FunctionExpression: {parameters: 'first'},
            CallExpression: {arguments: 'first'},
            ignoredNodes: ['TemplateLiteral']
        }],
        // Point-virgule obligatoire
        'semi': ['error', 'always'],
        // Désactive any explicite et ban-types en TS
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
        // Nommage des composants Vue
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            registeredComponentsOnly: false,
            ignores: []
        }],
        // Gestion des lignes vides
        'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 0, maxBOF: 0}],
        'eol-last': ['error', 'always']
    }
})
    // Configuration spécifique pour les templates Vue
    .prepend({
        files: ['**/*.vue'],
        rules: {
            // Indentation dans les <template> Vue
            'vue/html-indent': ['error', 4, {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: false,
                ignores: []
            }],
            // Un seul attribut par ligne sur plusieurs lignes
            'vue/max-attributes-per-line': ['error', {
                singleline: 1,
                multiline: 1
            }]
        }
    })
