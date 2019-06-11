const schedule = require('node-schedule');
const Axios = require('axios');
const sendMessage = require('./index').sendMessage;
const conf = require('./conf');
const bing = require('./plugins/bing');
const store = require('./store');
const news = require('./plugins/news');
module.exports = {
    async init() {
        this.today();
        this.good_morning();
        this.download_bing_pic();
        this.shanbay_sentence_today();
        this.news();
    },
    async good_morning() {
        let m_group = conf.group;
        let resp = '[QQ:pic=' + conf.morning_pic_path + ']';
        for (let i of m_group) {
            // Cron风格:
            // s, min, h, (day of month), month, (day of week)
            schedule.scheduleJob('0 0 6 * * *', async function () {
                sendMessage({
                    type: 2,
                    group: i + "",
                    qq: '',
                    content: resp
                });
            })
        }
    },
    async download_bing_pic() {
        let get_b = async function () {
            let res = await Axios.get('https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN');
            let url = 'https://bing.com' + res.data.images[0].url;
            bing(url);
            store.bing_text = res.data.images[0].copyright.split(" (")[0];
        };
        get_b();
        schedule.scheduleJob('0 1 6 * * *', async function () {
            get_b();
        })
    },
    async shanbay_sentence_today() {
        let get_b = async function () {
            let res = await Axios.get('https://rest.shanbay.com/api/v2/quote/quotes/today/');
            store.shanbay_sentence_today = res.data.data.content + "\n" + res.data.data.translation + "\n from: " + res.data.data.author;
        };
        get_b();
        schedule.scheduleJob('0 1 8 * * *', async function () {
            get_b();
        })
    },
    async news() {
        let get_b = async function (){
            let getItnewsList = new news();
            store.news = await getItnewsList.init();
        };
        get_b();
        schedule.scheduleJob('0 0 8 * * *', async function () {
            get_b();
        })
    },
    async today(){
        schedule.scheduleJob('1 0 0 * * *', async function () {
            store.today = new Date();
        })
    }
};