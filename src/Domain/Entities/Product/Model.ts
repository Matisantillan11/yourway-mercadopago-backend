import { Schema } from 'mongoose'
import { injectable } from 'inversify'

import Schemable from '@Domain/Entities/Util/Model'
import Nameable from '@Domain/Entities/Util/Ports/Nameable'

export const entity: string = 'product'

export const model = {
	name: {
		type: String,
		typed: 'string',
	},

	price: {
		type: Number,
		typed: 'number',
	},

	pic: {
		type: String,
		typed: 'string',
	},

	stock: {
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
