const ENV = process.env.NODE_ENV || 'development';
const isProduction = Number(ENV === 'production');

const OFF = 0;
const RECOMMENDED = 1;
const WARNING = 1 + isProduction;
const CRITICAL = 2;

module.exports = {
    root: true,

    parser: 'babel-eslint',

    plugins: ['react', 'ava'],
    extends: ["xo/esnext", "xo-react", "plugin:ava/recommended"],

    env: {
        commonjs: true,
        browser: true,
        node: true
    },

    parserOptions: {
        ecmaVersion: 8,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
            generators: true,
            experimentalObjectRestSpread: true
        }
    },

    settings: {
        'import/ignore': [
            'node_modules',
            '\\.(json|css|jpg|png|gif|eot|svg|ttf|woff|woff2|mp4|webm)$',
        ],
        'import/extensions': ['.js', '.jsx'],
        'import/resolver': {
            node: {
                extensions: ['.js', '.json', '.jsx']
            }
        }
    },

    rules: {
        'indent': [CRITICAL, 4],
        'space-before-function-paren': [CRITICAL, 'never'],
        'no-unused-vars': [CRITICAL, {vars: 'local', args: 'none'}],
        'func-names': CRITICAL,
        'object-shorthand': ["error", "properties"],
        'object-curly-spacing': [CRITICAL, 'always'],
        'array-bracket-spacing': [CRITICAL, 'always'],
        'one-var': [CRITICAL, 'never'],
        'curly': [CRITICAL, "multi-line"],
        'padded-blocks': OFF, 
        'generator-star-spacing': [CRITICAL, { before: false, after: true }],
        'yield-star-spacing': [CRITICAL, { before: false, after: true }],
        'operator-linebreak': [CRITICAL, 'after'],
        'react/jsx-indent': [CRITICAL, 4],
        'react/jsx-space-before-closing': [CRITICAL, 'always'],
        'react/forbid-component-props': OFF,
        'react/no-unused-prop-types': OFF,
        'react/jsx-indent-props': [CRITICAL, 4],
        'react/jsx-closing-bracket-location': OFF,
        'react/no-danger': OFF
    }
};
