import noSecretKey from './rules/no-secret-key'

const plugin = {
    rules: {
        'no-secret-key': noSecretKey,
    },
};

export default {
    rules: plugin.rules,
    configs: {
        recommended: {
            plugins: {
                abacatepay: plugin,
            },
            rules: {
                'abacatepay/no-secret-key': 'error',
            },
        },
    },
};
