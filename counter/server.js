const axios = require('axios')
const cheerio = require('cheerio')
const http = require('http')

const url = 'http://rgyy.wfust.edu.cn/book/more/type/4/lib/11'
const port = 8888

let myDate = new Date()

// 存储七日数据
//arrMon,arrTues,arrWed,arrThur,arrFri,arrSat,arrSun
let arr1,arr2,arr3,arr4,arr5,arr6,arr0 = [288]

// 请求解析剩余座位数量,返回当前剩余座位数字
async function fetchNum () {
    let counterDomNum = 0
    await axios.get(url)
        .then(function (response) {
            const $ = cheerio.load(response.data,{decodeEntities: false})
            const counterDom = $("div.col-xs-12.col-md-4 > span").text().slice(0,-1)
            counterDomNum = parseInt(counterDom)
        })
        .catch(function (error) {
            console.log(error)
        })
    return counterDomNum
}

// 向指定日期下标的数组中存储数据
function savaData () {
    const subscript = myDate.getHours()*12 + Math.floor(myDate.getMinutes()/5)
    const str = "arr" + myDate.getDay()

    fetchNum().then(num => {
        str[subscript] = num
        console.log(num + 'in' + str)
    })
}

// 一分钟一次触发，检查时间是否整五分钟
const timer = setInterval(function() {
    //整五分钟时将数据存入对应时间数组下标
    if(myDate.getMinutes()%5 === 0) {
        savaData ()
    }
},60000)



http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(port);


console.log('Server running at http://127.0.0.1:'+port+'/');
