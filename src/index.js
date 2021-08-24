const express = require('express')
const router = require('./network/routes.js')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

const corsOptions = {
	origin: '*',
	methods: 'GET, POST, PATCH, DELETE',
}

app.use(cors(corsOptions))
//server
app.set('port', 3000)
app.use(express.json())
const port = app.get('port')
router(app)

app.listen(port, () => {
	console.log(`Server start on port ${port}`)
})
