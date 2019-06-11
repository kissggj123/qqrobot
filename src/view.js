const Axios = require('axios');
const morning = require('./plugins/morning');
const shanbay_word = require('./plugins/shanbay');
let _SM = require('./index')._SM;
const conf = require('./conf');
const store = require('./store');

module.exports = {
    normal: {
        // 用户可用口令
        "help": async function help(data) {
            let resp = [
                "   + 通用",
                "hitokoto : 取自 hitokoto 的随机句子",
                "picsum : 取自 picsum 的随机图片",
                "picgrey : 灰度[QQ:emoji=4036988058]",
                "unsplash ： 取自 unsplash 的随机图片",
                "bing ： 取自 bing 的每日壁纸[QQ:emoji=4036991110]",
                "shanbay : 取自扇贝[QQ:emoji=4036989082]的单词",
                "shanbay2 ： 扇贝每日一句",
                "   + 涉嫌刷屏",
                "news : 取自IT之家的新闻[QQ:emoji=4036989832]",
                "36kr : 取自 36kr 的实时快讯",
                "   + 非通用",
                "bonjour : 在六点到八点的时光里打卡"
            ].join('\n');
            await _SM(data, resp)
        },
        "news": async function news(data) {
            await _SM(data, store.news)
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
            let resp = '[QQ:pic=' + conf.bing_pic_path + ']' + store.bing_text;
            await _SM(data, resp)
        },
        "shanbay2": async function shanbay2(data) {
            await _SM(data, store.shanbay_sentence_today)
        },
        "shanbay": async function shanbay(data) {
            await _SM(data, await shanbay_word())
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
            if (conf.group.indexOf(parseInt(data.group)) !== -1) {
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

