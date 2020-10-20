const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const http = require('http')

const url = 'http://rgyy.wfust.edu.cn/book/more/type/4/lib/11'
const port = 8888

// 存储七日数据
//arrSun,arrMon,arrTues,arrWed,arrThur,arrFri,arrSat
let arrData = new Array(7)
for (let i = 0; i < arrData.length; i++) {
    arrData[i] = new Array(288)
}

// 请求解析剩余座位数量,返回当前剩余座位数字
async function fetchNumFromHtml () {
    let counterDomNum = 0
    await axios.get(url)
        .then(function (response) {
            const $ = cheerio.load(response.data,{decodeEntities: false})
            const counterDom = $("div.col-xs-12.col-md-4 > span").text().slice(0,-1)
            counterDomNum = parseInt(counterDom)
        })
        .catch(function (error) {
            console.error(error)
        })
    return counterDomNum
}

// 向指定日期下标的数组中存储数据
function savaDataToArr () {
    const myDate = new Date()
    const subscript = myDate.getHours()*12 + Math.floor(myDate.getMinutes()/5)
    const day = myDate.getDay()

    fetchNumFromHtml().then(num => {
        arrData[day][subscript] = num
        console.log(num + ' in ' + subscript + ' at ' + day)
    })
}

// 保存数组到文件
function saveDataToFile () {
    fs.writeFile('store.json', JSON.stringify(arrData), function (err){
        if(err) {
            console.error(err)
        }
        console.log('Data saved (store.json)')
    })
}

// 从文件读取已存在数据
function readDataFromFile () {
    // 判断文件是否存在
    fs.stat('store.json',function (err,stat){
        if(stat&&stat.isFile()) {
            // 存在时读取文件
            fs.readFile('store.json',function (err,data){
                if (err) {
                    console.error(err)
                }
                arrData = JSON.parse(data.toString())
            })
        } else {
            // 不存在时仅做提醒
            console.log('store.json does not exist, Will be created automatically')
        }
    })
}

// 定时任务，获取数据及数据本地保存
function setTimer () {
    console.log('Start Timer')

    // 半分钟一次触发，检查时间是否整五分钟
    setInterval(function() {
        const myDate = new Date()
        //整五分钟时将数据存入对应时间数组下标
        if(myDate.getMinutes()%5 === 0) {
            savaDataToArr()
        }
    },1000*30)

    // 每十分钟对已收集数据进行保存
    setInterval(function() {
        saveDataToFile ()
    },1000*60*10)
}

// 程序入口
function start () {
    readDataFromFile()
    setTimer()

    http.createServer(function (request, response) {
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
        response.end(JSON.stringify(arrData))
    }).listen(port)
    console.log('Server running at port '+port)
}

start()
