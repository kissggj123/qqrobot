const view = require('./view');
module.exports = class router {
    constructor(data) {
        this.data = data
    }

    async init() {
        await this.switcher()
    }

    async switcher() {
        if (view.normal[this.data.content] !== undefined) {
            view.normal[this.data.content](this.data);
        }
    }
}