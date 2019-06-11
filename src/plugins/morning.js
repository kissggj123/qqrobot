const mongoose = require('mongoose');
const _SM = require('../index')._SM;
require('../schema/user');
const user = mongoose.model('user');
const store = require('../store');

// 新增关键词
module.exports = async (req) => {
    const id = req.qq;
    const group = req.group;
    const now = new Date();

    const check_time = async function (r) {
        if (r.time.getDate() !== now.getDate()) {
            if ((5 < now.getHours()) && (now.getHours() < 8)) {
                await sign(r)
            } else {
                await showDetail(r, "E 错过打卡")
            }
        } else {
            await showDetail(r, "O 今日打卡已完成")
        }
    };
    const sign = async function (data) {
        let keep_sum = 1;
        if (now.getDate() - data.time.getDate() === 1) {
            keep_sum = data.keep + 1
        }
        user.findOneAndUpdate({qq: id, group: group}, {
            $set: {
                keep: keep_sum,
                sum: data.sum + 1,
                time: now
            }
        }, {new: true}).then(async (r) => {
            await showDetail(r)
        });
    };
    const showDetail = async function (data, text) {
        console.log('keep', data.keep);
        let pre_word = 'S 打卡成功';
        if (text) pre_word = text;
        let p1 = (async function () {
            let getList_r = '弟';
            if (data.time.getDate() === now.getDate()) {
                await getList(id, group, store.today, {time: -1}).then((r) => {
                    getList_r = r;
                });
            }
            return getList_r
        })();
        // let p2 = getList(id, group, {sum: -1});
        // let p3 = getList(id, group, {keep: -1});
        Promise.all([p1,]).then(async (values) => {
            let resp = [
                `[QQ:at=${id}]`,
                `${pre_word}`,
                `保持 ${data.keep} 天 累计 ${data.sum} 天`,
                `今晨打卡第 ${values[0]} 位`,
            ].join('\n');
            await _SM(req, resp)
        });
    };
    const getList = async (id, group, time_limit, rule) => {
        return await user.find({group: group, time: {$gt: time_limit}}).sort(rule).then((data) => {
            if (data.length) {
                let index = data.findIndex(function (x) {
                    return x.qq == id
                });
                return ++index
            } else {
                return false
            }
        });
    };

    await user.findOne({qq: id, group: group}).then(async (r) => {
        if (r) {
            await check_time(r);
        } else {
            // 新增用户
            let kitty = new user({qq: id, group: group});
            await kitty.save().then(async (r) => {
                await check_time(r);
            });
        }
    });
};