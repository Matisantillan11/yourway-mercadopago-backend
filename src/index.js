const express = require("express")
const router = require("./network/routes.js")
const bodyParser = require('body-parser')

const app = express()


//server 
app.set("port", 3000)
app.use(bodyParser.urlencoded({ extended: false }))
const port = app.get("port")
router(app)

app.listen(port, () =>{
    console.log(`Server start on port ${port}` )
});