const Axios = require('axios');
module.exports = async function () {
    let arr = [];
    let url = "https://www.shanbay.com/api/v1/bdc/vocabulary/?version=2&ids=";
    for (let i = 0; i < 5; i++) {
        if (i > 0) url += ",";
        url += (Math.round(Math.random() * 10000))
    }
    let res = await Axios.get(url, {
        headers: {
            "Cookie": 'auth_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MjE3NzgxOTEzLCJleHAiOjE1NjA1OTIxMjcsImRldmljZSI6IiIsInVzZXJuYW1lIjoiUGhvbmVfYWQzZDUwYWViMTZjYzdmZiIsImlzX3N0YWZmIjowfQ.jcimRJkKgg8sHo4mIEpnnb8MtLacjVcNb-mHDGM5bJs'
        }
    });
    // console.log(res)
    for (let one of res.data.data) {
        let loc = [];
        loc.push(one['content'] + " ::");
        for (let two of one['definitions']['cn']) {
            loc.push("(" + two['pos'] + ") : " + two['defn'])
        }
        arr.push(loc.join('\n'))
    }
    return arr.join('\n ===== \n\n')
};