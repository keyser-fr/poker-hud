const readline = require('readline');
const fs = require('fs');
const fp = require('lodash/fp');
const _ = require('lodash');

const winamax = require('./parsers/winamax.js');
const af = require('./metrics/af.js');
const vpip = require('./metrics/vpip.js');

const rl = readline.createInterface({
    input: fs.createReadStream('static/sample_mtt.txt')
});

winamax.parse(rl, [af, vpip]).then(function (results) {
    _(results).forEach(function (metrics, playerName) {
        const vpip = _.get(metrics, 'vpip', 0);
        const pfr = _.get(metrics, 'pfr', 0);
        const vnpip = _.get(metrics, 'vnpip', 0);
        const af_pre_calls = _.get(metrics, 'af_pre_calls', 0);
        const af_post_calls = _.get(metrics, 'af_post_calls', 0);
        const af_pre_bets = _.get(metrics, 'af_pre_bets', 0);
        const af_post_bets = _.get(metrics, 'af_post_bets', 0);
        console.log('=== ' + playerName + ' (' + (vpip + vnpip) + ') ===');
        if (vpip + vnpip > 0) {
            console.log('VP$IP: ' + Math.round(100 * vpip / (vpip + vnpip)) + '% ');
            console.log('PFR: ' + Math.round(100 * pfr / (vpip + vnpip)) + '%');
            if (af_pre_calls + af_post_calls > 0) {
                console.log('AF: ' + Math.round(10 * (af_pre_bets + af_post_bets) / (af_pre_calls + af_post_calls)) / 10);
            } else if (af_pre_bets + af_post_bets > 0) {
                console.log('AF: Infinity');
            }
        }
    });
})