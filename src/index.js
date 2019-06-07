const QQBot = require('./bot');
const wsPath = require('./conf').wsPath;

require('./mongo');

const bot = new QQBot();
const {
    sendMessage,
    handleFriendRequest,
    handleGroupRequest
} = bot.api;

let _SM = async function (data, resp) {
    sendMessage({
        type: data.type,
        group: data.group,
        qq: data.qq,
        content: resp
    });
};
module.exports = {
    sendMessage,_SM
};

const router = require('./router');
const schedule = require('./schedule');

async function start() {
    try {
        console.log(wsPath);
        // 连接QQLight-WebSocket插件服务器
        await bot.connect(wsPath);
        // 这里的 127.0.0.1 可以替换成服务器公网IP
        console.log("connect OK");
        bot.on('message', async (event, data) => {
            let comp = new router(data);
            comp.init()
        });
        bot.on('friendRequest', async (event, data) => {
            handleFriendRequest({
                "qq": data.qq,
                "type": 1,
                // 1=同意、2=拒绝、3=忽略
                "message": ""
                // 拒绝理由，仅在拒绝请求时有效
            });
        });
        bot.on('groupRequest', async (event, data) => {
            if (data.type === 3) {
                handleGroupRequest({
                    "group": "",
                    "qq": "",
                    "seq": "",   // 加群请求事件提供的序列号
                    "type": 1,    // 1=同意、2=拒绝、3=忽略
                    "message": ""    // 拒绝时的拒绝理由，其它情况忽略
                });
            }
        });
    } catch (err) {
        console.error(err);
        process.exit(-1);
    }
}

database();
start();
schedule.init();