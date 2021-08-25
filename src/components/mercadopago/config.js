const mercadopago = require('mercadopago')
const createReference = async (item) => {
	//mp
	// Agrega credenciales
	mercadopago.configure({
		access_token:
			'APP_USR-7650882508392725-070617-c653c354c03765866912126e47b7e646-134684389',
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
