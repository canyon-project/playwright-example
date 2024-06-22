const fs = require('fs');
const path = require('path');
const libCoverage = require('istanbul-lib-coverage')
function mergeCoverageMap(first, second) {
    const map = libCoverage.createCoverageMap(JSON.parse(JSON.stringify(first)));
    map.merge(second);
    return JSON.parse(JSON.stringify(map.toJSON()));
}


// 定义 public 目录的路径
const publicDir = path.join(__dirname, 'public');

// 读取 public 目录的内容
const files = fs.readdirSync(publicDir);

// 过滤出 JSON 文件
const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

// 读取每个 JSON 文件
const map = new Map()
if (jsonFiles.length===0){
    console.log('没找到覆盖率数据')
}
jsonFiles.forEach((file,index) => {
    const filePath = path.join(publicDir, file);

    const jsondata =  fs.readFileSync(filePath, 'utf8');
    // console.log(index,jsondata)
    const projectID = JSON.parse(jsondata).projectID
    if (map.get(projectID)){
        // map.get(projectID).push(JSON.parse(jsondata))
        const cov = {
            ...map.get(projectID),
            coverage:mergeCoverageMap(map.get(projectID).coverage,JSON.parse(jsondata).coverage)
        }
        map.set(projectID,cov)
    } else {
        map.set(projectID,JSON.parse(jsondata))
    }
});

// console.log(map)

for (const [key,value] of map) {
    fs.writeFileSync(key+'.json',JSON.stringify(value))
}