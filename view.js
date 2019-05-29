const Axios = require('axios')
const http = require('https')
const news = require('./plugins/news')
module.exports = {
    async help() {
        return "" +
            "news : 来自IT之家的新闻\n" +
            "hitokoto : 来自 hitokoto 的随机句子\n" +
            "picsum : 来自 picsum 的随机图片\n" +
            "picsum_grey : 加上灰度\n" +
            "unsplash ： 来自 unsplash 的随机图片\n" +
            "bing ： 来自 bing 的每日壁纸\n" +
            "shanbay_today ： 扇贝的每日一句\n" +
            "shanbay : 每次随机抽取5个单词\n" +
            "newsflash : 来自 36kr 的快讯"
    },
    async news() {
        let getItnewsList = new news()
        let data = await getItnewsList.init()
        return data
    },
    async hitokoto() {
        let res = await Axios.get('https://v1.hitokoto.cn/')
        return res.data['hitokoto'] + " \nfrom: " + res.data['from']
    },
    async picsum() {
        let loc = '[QQ:pic=https://picsum.photos/id/' + (Math.round(Math.random() * 1000)) + '/400/800]'
        return loc
    },
    async picsum_grey() {
        let loc = '[QQ:pic=https://picsum.photos/id/' + (Math.round(Math.random() * 1000)) + '/400/800?grayscale]'
        return loc
    },
    async unsplash() {
        let loc = '[QQ:pic=https://picsum.photos/id/' + (Math.round(Math.random() * 1000)) + '/400/800]'
        return loc
    },
    async bing() {
        let res = await Axios.get('https://bing.com/HPImageArchive.aspx?format=js&idx=1&n=1&mkt=zh-CN')
        return '[QQ:pic=https://bing.com' + res.data.images[0].url + '] ' + res.data.images[0].copyright.split(" (")[0]
    },
    async shanbay_today() {
        let res = await Axios.get('https://rest.shanbay.com/api/v2/quote/quotes/today/')
        return res.data.data.content + "\n" + res.data.data.translation + "\n from: " + res.data.data.author
    },
    async shanbay() {
        let loc = ''
        let url = "https://www.shanbay.com/api/v1/bdc/vocabulary/?version=2&ids="
        for (let i = 0; i < 5; i++) {
            if (i > 0) url += ","
            url += (Math.round(Math.random() * 10000))
        }
        let res = await Axios.get(url, {
            headers: {
                "Cookie": 'auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlBob25lX2FkM2Q1MGFlYjE2Y2M3ZmYiLCJkZXZpY2UiOjAsImlzX3N0YWZmIjpmYWxzZSwiaWQiOjIxNzc4MTkxMywiZXhwIjoxNTU5NzIyODczfQ.8uBq8Nwsz1xUQm0IghmKYIZxZ4EW20IFGDETi2CcZ1A;'
            }
        })
        for (let one of res.data.data) {
            loc += (one['content'] + " ::\n")
            for (let two of one['definitions']['cn']) {
                loc += ("(" + two['pos'] + ") : " + two['defn'] + "\n")
            }
            loc += " ===== \n\n"
        }
        return loc
    },
    async newsflash() {
        let loc = ''
        let res = await Axios.get("https://36kr.com/pp/api/newsflash")
        for (let one of res.data.data.items) {
            loc += (one['title'] + "\n" + "\n" + one['description'] + "\n")
            loc += " ===== \n\n"
        }
        return loc
    }
};

