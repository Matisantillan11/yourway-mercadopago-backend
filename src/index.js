const express = require('express')
const router = require('./network/routes.js')
require('dotenv').config()

const app = express()

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Request-Methods', 'GET, POST, PATCH')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	)
	next()
})
//server
app.use(express.json())
const port = process.env.PORT || 3000
router(app)

app.listen(port, () => {
	console.log(`Server start on port ${port}`)
})
