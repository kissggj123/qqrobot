const QQBot = require('./bot');
const router = require('./router');

async function start() {
    const bot = new QQBot();
    console.log("start")
    try {
        // 连接QQLight-WebSocket插件服务器
        await bot.connect('ws://127.0.0.1:49632/');
        // 这里的 127.0.0.1 可以替换成服务器公网IP
        console.log("connect OK")
    } catch (err) {
        console.error(err);
        process.exit(-1);
    }

    // 导出QQ机器人接口
    const {
        sendMessage,
        handleFriendRequest,
        handleGroupRequest
    } = bot.api;

    // 监听收到消息事件
    bot.on('message', async (event, data) => {
        let comp = new router(data)
        let resp = await comp.init()
        console.log(data)
        sendMessage({
            type: data.type,
            group: data.group,
            qq: data.qq,
            content: resp
        });
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


}

start();