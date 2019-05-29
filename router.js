const view = require('./view')
module.exports = class router {
    constructor(data) {
        this.data = data
    }

    async init() {
        console.log("msg_get")
        let reply = await this.chooser()
        return reply
    }

    async chooser() {
        if (view[this.data.content] === undefined) {
            return ''
        } else {
            return view[this.data.content](this.data);
        }
    }

}