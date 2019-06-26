const axios = require('axios');
const qs = require('qs');

const sinoni = async (params) => {
    if (!params) {
        return Promise.reject('ERROR PARAMS');
    }

    let api = JSON.parse(JSON.stringify(params));
    api.timeout = api.timeout ? parseInt(api.timeout) : 300;
    let {id} = api;

    if (!id) {
        try {
            let {data} = await axios.post('https://api.rewriter.tools', qs.stringify(api));
            if (!data.id) {
                return Promise.reject('ERROR ID');
            }
            api.id = data.id;
        } catch (e) {
            console.error(e);
            return Promise.reject('ERROR POST');
        }
    }

    return new Promise(resolve => {
        let result = api, n = 0, i = setInterval(() => {
            axios.post('https://api.rewriter.tools', qs.stringify(api)).then(res => {
                let {rewrite, percent, words, spam, water} = res && res.data && res.data.result
                    ? res.data.result
                    : {};
                if (rewrite) {
                    if (api.unique) {
                        if (
                            typeof percent === 'number' &&
                            typeof words === 'number' &&
                            typeof spam === 'number' &&
                            typeof water === 'number'
                        ) {
                            clearInterval(i);
                            return resolve(result);
                        }
                    } else {
                        clearInterval(i);
                        return resolve(result);
                    }
                }
            }).catch(() => {
                clearInterval(i);
                return resolve(result);
            });
            if (++n >= api.timeout / 2) {
                clearInterval(i);
                return resolve(result);
            }
        }, 2000);
    });
};

module.exports = sinoni;