const Axios = require('axios');
const news = require('./plugins/news');
const morning = require('./plugins/morning');
let _SM = require('./index')._SM;
const group = require('./conf').group;

module.exports = {
    normal: {
        // 用户可用口令
        "help": async function help(data) {
            let resp = [
                "news : 取自IT之家的新闻[QQ:emoji=4036989832]",
                "hitokoto : 取自 hitokoto 的随机句子",
                "picsum : 取自 picsum 的随机图片",
                "picgrey : 灰度[QQ:emoji=4036988058]",
                "unsplash ： 取自 unsplash 的随机图片",
                "bing ： 取自 bing 的每日壁纸[QQ:emoji=4036991110]",
                "shanbay : 随机取自扇贝[QQ:emoji=4036989082]的单词",
                "shanbay2 ： 扇贝的每日一句",
                "36kr : 取自 36kr 的快讯",
                // "bonjour : 在早上六点到七点的时光里打卡"
            ].join('\n');
            await _SM(data, resp)
        },
        "news": async function news(data) {
            let getItnewsList = new news();
            let resp = await getItnewsList.init();
            await _SM(data, resp)
        },
        "hitokoto": async function hitokoto(data) {
            let res = await Axios.get('https://v1.hitokoto.cn/');
            let resp = res.data['hitokoto'] + " \nfrom: " + res.data['from'];
            await _SM(data, resp)
        },
        "picsum": async function picsum(data) {
            let resp = '[QQ:pic=https://picsum.photos/id/' + (Math.round(Math.random() * 1000)) + '/400/800]';
            await _SM(data, resp)
        },
        "picgrey": async function picsum_grey(data) {
            let resp = '[QQ:pic=https://picsum.photos/id/' + (Math.round(Math.random() * 1000)) + '/400/800?grayscale]';
            await _SM(data, resp)
        },
        "unsplash": async function unsplash(data) {
            let resp = '[QQ:pic=https://picsum.photos/id/' + (Math.round(Math.random() * 1000)) + '/400/800]';
            await _SM(data, resp)
        },
        "bing": async function bing(data) {
            let res = await Axios.get('https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');
            let resp = '[QQ:pic=https://bing.com' + res.data.images[0].url + '] ' + res.data.images[0].copyright.split(" (")[0];
            await _SM(data, resp)
        },
        "shanbay2": async function shanbay2(data) {
            let res = await Axios.get('https://rest.shanbay.com/api/v2/quote/quotes/today/');
            let resp = res.data.data.content + "\n" + res.data.data.translation + "\n from: " + res.data.data.author;
            await _SM(data, resp)
        },
        "shanbay": async function shanbay(data) {
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
            let resp = arr.join('\n ===== \n\n');
            await _SM(data, resp)
        },
        "36kr": async function newsflash(data) {
            let loc = '';
            let res = await Axios.get("https://36kr.com/pp/api/newsflash");
            for (let one of res.data.data.items) {
                loc += (one['title'] + "\n" + "\n" + one['description'] + "\n");
                loc += " ===== \n\n"
            }
            await _SM(data, loc)
        },
        "bonjour": async function bonjour(data) {
            if(group.indexOf(parseInt(data.group)) !== -1){
                morning(data)
            }
        }
    }
    // async bing() {
    //     let loc = ''
    //     await (function () {
    //         return new Promise(resolve => {
    //             http.get('https://bing.com/HPImageArchive.aspx?format=js&idx=1&n=1&mkt=zh-CN', async function (response) {
    //                 response.setEncoding('utf8')
    //                 response.on('data', function (chunk) {
    //                     let dat = JSON.parse(chunk)
    //                     let pa = dat["images"][0]['url']
    //                     pa = pa.split('&')[0]
    //                     loc = '[QQ:pic=https://bing.com' + pa + ']'
    //                     resolve();
    //                 });
    //             })
    //         })
    //     })()
    //     return loc
    // }
};

