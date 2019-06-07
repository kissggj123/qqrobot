const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let _date = function () {
    let date = new Date();//获取当前时间
    date.setDate(date.getDate() - 1);//设置天数 -1 天
    return date
};
const userSchema = new Schema({
    createtime: {
        type: Date,
        default: Date.now()
    },
    group: Number,
    qq: Number,
    time: {
        // 上次早起打卡时间
        type: Date,
        default: _date()
    },
    keep: {
        // 连续早起打卡
        type: Number,
        default: 0
    },
    sum: {
        // 累计早起打卡
        type: Number,
        default: 0
    },
    score: {
        // 积分
        type: Number,
        default: 0
    }
});

mongoose.model('user', userSchema);