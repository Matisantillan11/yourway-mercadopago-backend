const mercadopago = require('mercadopago')
const createReference = async (item) => {
	//mp
	// Agrega credenciales
	mercadopago.configure({
		access_token:
			'APP_USR-1211955142597430-081120-95fdef3e3088b5aebdf71c968b8120e9-806110258',
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
