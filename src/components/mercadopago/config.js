const mercadopago = require('mercadopago')
const createReference = async (item) => {
	//mp
	// Agrega credenciales
	mercadopago.configure({
		access_token: process.env.ACCESS_TOKEN_P,
	})

	let preference = { items: [] }

	item.map((item) =>
		preference.items.push({
			title: item.name,
			unit_price: parseInt(item.price),
			quantity: parseInt(item.quantity),
		}),
	)

	let initPoint
	await mercadopago.preferences
		.create(preference)
		.then((response) => {
			initPoint = response.body.init_point
		})
		.catch((error) => {
			console.error('error mercadopago: ', error)
		})

	return initPoint
}

module.exports = createReference
