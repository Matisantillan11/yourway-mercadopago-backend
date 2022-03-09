import InterfaceUtil from '@Domain/Entities/Util/Ports/Dtoable'
import { Schema } from 'mongoose'

export default interface Interface extends InterfaceUtil {
	name: string
	price: number
	pic: string
	stock: number
	category: Schema.Types.ObjectId
}
