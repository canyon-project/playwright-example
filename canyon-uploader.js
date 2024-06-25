const fs = require('fs');
const path = require('path');
const libCoverage = require('istanbul-lib-coverage')

function mergeCoverageMap(first, second) {
    const map = libCoverage.createCoverageMap(JSON.parse(JSON.stringify(first)));
    map.merge(second);
    return JSON.parse(JSON.stringify(map.toJSON()));
}

// 定义 public 目录的路径
const publicDir = path.join(__dirname, '.canyon_output');

// 读取 public 目录的内容
const files = fs.readdirSync(publicDir);

// 过滤出 JSON 文件
const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

// 读取每个 JSON 文件
const map = new Map()
if (jsonFiles.length === 0) {
    console.log('canyon: no coverage files found in .canyon_output')
}
jsonFiles.forEach((file, index) => {

    const filePath = path.join(publicDir, file);

    const jsondata = fs.readFileSync(filePath, 'utf8');

    // 检查文件格式
    if (jsondata) {
        try {
            const data = JSON.parse(jsondata)
            if (data.dsn && data.reporter && data.coverage && data.projectID && data.commitSha && data.instrumentCwd) {
                const projectID = data.projectID
                if (map.get(projectID)) {
                    const cov = {
                        ...map.get(projectID),
                        coverage: mergeCoverageMap(map.get(projectID).coverage, data.coverage)
                    }
                    map.set(projectID, cov)
                } else {
                    map.set(projectID, data)
                }
            } else {
                console.log('格式不正确')
            }


        } catch (e) {
            console.log('不是json数据')
        }
    }
});


for (const [key, value] of map) {
    fetch(value.dsn, {
        method: 'POST',
        body: JSON.stringify(value),
        headers: {
            Authorization: `Bearer ${value.reporter}`,
            'Content-Type': 'application/json' // 指定请求头中的内容类型为 JSON
        },
    }).then(res => res.json()).then(data => {
        console.log(data)
    })
}