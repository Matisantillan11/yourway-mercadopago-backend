import { Schema } from 'mongoose'
import { injectable } from 'inversify'

import Schemable from '@Domain/Entities/Util/Model'
import Nameable from '@Domain/Entities/Util/Ports/Nameable'

export const entity: string = 'payment'

export const model = {
	name: {
		type: String,
		typed: 'string',
	},

	amountMeli: {
		type: String,
		typed: 'string',
	},
	discountMeli: {
		type: String,
		typed: 'string',
	},
	totalMeli: {
		type: String,
		typed: 'string',
	},
	operationNumberMeli: {
		type: String,
		typed: 'string',
	},
	statusMeli: {
		type: String,
		typed: 'string',
	},
	ejectMeli: {
		type: Date,
		typed: 'date',
	},
	paymentMethodMeli: {
		type: String,
		typed: 'string',
	},
	barcodeMeli: {
		type: String,
		typed: 'string',
	},
	transactionNumbreMeli: {
		type: String,
		typed: 'string',
	},
	finalCollectorMeli: {
		type: String,
		typed: 'string',
	},
	idMeli: {
		type: Number,
		typed: 'number',
	},

	entity: {
		type: String,
		typed: entity,
	},
}

@injectable()
export default class ENTITY_SCHEMA extends Schemable implements Nameable {
	public name: string
	'user'
	constructor() {
		super(model, {
			collection: entity,
		})

		this.name = entity
	}
}
