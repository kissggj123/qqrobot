const schedule = require('node-schedule');
const sendMessage = require('./index').sendMessage;
const group = require('./conf').group;
module.exports = {
    async init() {
        this.good_morning()
    },
    async good_morning() {
        let img_path = '';
        let m_group = group;
        for (let i of m_group) {
            // Cron风格:
            // s, min, h, (day of month), month, (day of week)
            schedule.scheduleJob('0 0 6 * * *', async function () {
                sendMessage({
                    type: 2,
                    group: i,
                    qq: '2',
                    content: '[QQ:pic=C:\\Users\\Administrator\\Desktop\\QQLight\\QQLight\\img\\morning.jpg]'
                });
            })
        }
    }
};