const axios = require('axios')

module.exports = class news {
    constructor() {
        this.data = []
    }

    async init() {
        let list = await this.getItnewsList();
        if (list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].lapinid) {
                } else {
                    this.data.push(list[i].title)
                }
            }
            return this.data.join('\n - - - - \n')
        }
    }

    // get Hacknews list
    async getItnewsList() {
        try {
            let data = await axios.get('https://api.ithome.com/json/newslist/news?r=0')
            if (data.status === 200) {
                let res = data.data.newslist;
                if (res) {
                    return res
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
};