module.exports = {
    env: {
        jest: true
    },
    rules: {
        'import/no-extraneous-dependencies': 'off',
        'space-before-function-paren': ['error', {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }]
    }
}