const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

let startDate = null

const url = 'http://yangsheng.cn'
const thread = 3

// 程序入口，先获取用户的日期输入
new function setDate() {
    readline.question(`请以 yyyy-MM 格式输入下载的歌曲的起始日期，留空则全部下载: `, date => {
        // 将输入的日期转换为日期对象
        startDate = new Date(date + '-01T00:00:00')
        // 如果日期合法
        if (startDate.toString() !== 'Invalid Date') {
            console.log(`将从${startDate.getFullYear()}年${startDate.getMonth()+1}月的歌开始下载以此往后的歌曲`)
            creatTask()
        // 如果日期没填
        } else if (date.length == 0) {
            startDate = new Date('2014-05-01T00:00:00')
            console.log(`将下载所有的歌曲`)
            creatTask()
        // 填写了错误的日期
        } else {
            console.log(`输入有误，正确的 yyyy-MM 格式应形如 1926-08`)
            setDate()
        }
    })
}

// 创建一个下载任务，将会拉取对应年月列表并发起下载
function creatTask() {
    const now = new Date()
    // 和当前日期比较，当接下来的日期晚于当前日期则表示下载已完成
    if (startDate.getTime() > now.getTime()) {
        console.log(`已完成下载任务`)
        return 0
    }

    fetchList().then(list => {
        // 当列表为空则直接拉取下个月的列表
        // 当列表不为空则下载该月份对应曲目
        if (JSON.stringify(list) !== '{}') {
            // console.log(list)
            // todo: 从列表中取出 url 逐个下载
        } else {
            console.log(`${startDate.getFullYear()}年${startDate.getMonth()+1}月没有曲目`)
            startDate.setMonth(startDate.getMonth()+1)
            creatTask()
        }
    })

}

// 拉取拉取当下日期的列表，以对象返回列表
async function fetchList() {
    const listUrl = `${url}/EDS/GetSong.asp?Y=${startDate.getFullYear()}&M=${startDate.getMonth()+1}`
    return await axios.get(listUrl).then((response) => {
        let list = {}
        // 解析 html
        const $ = cheerio.load(response.data,{ decodeEntities: false })
        // 当列表为空直接返回空对象
        if ($(`a:eq(0)`).attr("onclick") === undefined) {
            return {}
        }
        // 遍历 dom
        for (let i=0; i < $('a').length; i++) {
            // 获取每一项，删掉没用的字符，并转换为数组
            let item = $(`a:eq(${i})`).attr("onclick").slice(10).replace(/'/g,'').replace(/杨生音响（公众号）提供/g,'')
            item = item.substring(0,item.length-2).split(',')
            // console.log(item[3])
            // 将数组中项目添加到对象
            list[item[3]] = {}
            list[item[3]].name = item[0]
            list[item[3]].url = item[1]
        }
        return list
        // return {'me':'cute!'}
    })
}

// 传入 url 下载歌曲
function downloadSong(url) {

}