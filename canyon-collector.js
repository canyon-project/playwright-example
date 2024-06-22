const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json({ extended: true }))

const runtimePath = process.cwd();
app.post('/coverage/client',(req, res)=>{
    console.log('请求到了'+new Date(),path.join(runtimePath, 'public/data.json'))
    fs.writeFileSync(path.join(runtimePath, `public/${new Date().valueOf()}.json`),JSON.stringify(req.body))
    res.send({
        msg:'ok'
    })
})

app.listen(3000,()=>{
    console.log('start')
})