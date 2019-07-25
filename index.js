const axios = require('axios');
const qs = require('qs');

const sinoni = async (params) => {
    if (!params) {
        return Promise.reject('ERROR PARAMS');
    }

    let api = JSON.parse(JSON.stringify(params));
    api.timeout = api.timeout ? parseInt(api.timeout) : 300;
    let {id, token} = api;

    let domain = api.lang && api.lang === 'ru'
        ? 'sinoni.men'
        : 'rewriter.tools';

    if (!id) {
        try {
            let {data} = await axios.post('https://api.' + domain, qs.stringify(api));
            if (!data || !data.result || !data.result.id) {
                return Promise.reject('ERROR ID');
            }
            id = data.result.id;
            api.id = data.result.id;
        } catch (e) {
            console.error(e);
            return Promise.reject('ERROR POST');
        }
    }

    return new Promise(resolve => {
        let n = 0, i = setInterval(() => {
            axios.post('https://api.' + domain, qs.stringify(api)).then(res => {
                let {rewrite, percent, words, spam, water} = res && res.data && res.data.result
                    ? res.data.result
                    : {};
                if (rewrite) {
                    if (
                        (typeof api.unique === 'boolean' && api.unique === true) ||
                        (typeof api.unique === 'string' && api.unique === 'true') ||
                        (typeof api.unique === 'number' && api.unique === 1) ||
                        (typeof api.unique === 'string' && api.unique === '1')
                    ) {
                        if (
                            typeof percent === 'number' &&
                            typeof words === 'number' &&
                            typeof spam === 'number' &&
                            typeof water === 'number'
                        ) {
                            clearInterval(i);
                            return resolve({token, id, rewrite, percent, words, spam, water});
                        }
                    } else {
                        clearInterval(i);
                        return resolve({token, id, rewrite});
                    }
                }
            }).catch(() => {
                clearInterval(i);
                return resolve({token, id});
            });
            if (++n >= api.timeout / 2) {
                clearInterval(i);
                return resolve({token, id});
            }
        }, 2000);
    });
};

module.exports = sinoni;