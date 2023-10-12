module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "standard-with-typescript",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "rules": {
        "no-console": "off",
        "unused-vars": "off"
    },
    "ignorePatterns": [
        "node_modules/",
        "dist/",
        "views/"
    ]
}
