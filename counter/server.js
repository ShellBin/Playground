const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const http = require('http')

const url = 'http://rgyy.wfust.edu.cn'
const port = 8888

// 存储七日数据
//arrSun,arrMon,arrTues,arrWed,arrThur,arrFri,arrSat
let arrData = new Array(7)
for (let i = 0; i < arrData.length; i++) {
    arrData[i] = new Array(288)
}

// 从主页取出当前的预约页面 URL
let urlAPI = undefined
async function fetchAPIUrl () {
    await axios.get(url)
        .then(function (response) {
            const myDate = new Date()
            const $ = cheerio.load(response.data)
            if(myDate.getHours <= 21 && myDate.getHours >= 5) {
                urlAPI = $('.btn-info').attr('href')
            }
        })
        .catch(function (error) {
            console.error(error)
        })
}


// 请求解析当前人数,返回当前人数
async function fetchNumFromHtml () {
    let counterDomNum = 0
    await axios.get('http://rgyy.wfust.edu.cn'+ urlAPI)
        .then(function (response) {
            const $ = cheerio.load(response.data,{decodeEntities: false})
            const counterDom = $("body > div.col-xs-12.col-sm-9.xiaoqu > div.x_panel > div.col-xs-12.col-md-9.content > div:nth-child(2)").text().substring(6,14)
            console.log('当前原始数据： ' + counterDom)
            counterDomNum = parseInt(counterDom.split('/')[0])
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

    if (urlAPI === undefined) {
        console.log('当前不能获取有效数据')
        arrData[day][subscript] = null
    } else {
        fetchNumFromHtml().then(num => {
            arrData[day][subscript] = num
            console.log(num + ' in ' + subscript + ' at ' + day)
        })
    }
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

    // 半分钟一次触发，检查时间是否整五分钟，并获取新的 API 地址
    setInterval(function() {
        const myDate = new Date()
        // 每半分钟获取一次 API 地址
        fetchAPIUrl()
        // 整五分钟时将数据存入对应时间数组下标
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
    fetchAPIUrl()
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
