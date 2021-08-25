const express = require('express')
const router = require('./network/routes.js')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

/* const corsOptions = {
	origin: '*',
	methods: 'GET, POST, PATCH, DELETE',
}

app.use(cors(corsOptions)) */

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
app.set('port', 3000)
app.use(express.json())
const port = app.get('port')
router(app)

app.listen(port, () => {
	console.log(`Server start on port ${port}`)
})
