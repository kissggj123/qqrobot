const request = require("request");
let fs = require("fs");

module.exports = async (url) => {
    let fileName = "out.jpg";
    console.log("plugin: bing")
    let stream = fs.createWriteStream(fileName);
    request(url).pipe(stream).on("close", function (err) {
        console.log("文件[" + fileName + "]下载完毕");
    });
};