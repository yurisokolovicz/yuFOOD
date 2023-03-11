// Functions that we reuse over and over in our project.
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const getJSON = async function (url) {
    try {
        const fetchPro = fetch(url);
        // As soon as any of these promises in the race (fetchPro or timeout) rejects or fulfills, than that promise will become the winner (upload website or timeout)
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        // data is the result value of the promise of the getJSON function returns
        return data;
    } catch (err) {
        // Error appears in helper.js
        // console.log(err);

        // With throw err, the promise that`s being returned from getJSON will be rejected (it will appears only in the model.js)
        throw err;
    }
};
