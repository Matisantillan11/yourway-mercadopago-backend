const express = require('express')
const createReference = require('./config')

const router = express.Router()

router.post('/mercado-pago/checkout', async (req, res) => {
	const uri = await createReference(req.body.cart)
	res.send(uri)
})

module.exports = router
