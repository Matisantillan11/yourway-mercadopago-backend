const express = require('express')
const router = require('./network/routes.js')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

const corsOptions = {
	origin: '*',
	methods: 'GET, POST, PATCH, DELETE',
}

app.use(cors(corsOptions))

//server
app.set('port', 3000)
app.use(express.json())
const port = process.env.PORT || app.get('port')
router(app)

app.listen(port, () => {
	console.log(`Server start on port ${port}`)
})
