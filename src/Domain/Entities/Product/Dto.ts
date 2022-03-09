import { injectable } from 'inversify'

import DtoUtil from '@Domain/Entities/Util/Ports/Dto'
import Interface from './Interface'
import { Schema } from 'mongoose'

@injectable()
export default class EntityDto extends DtoUtil implements Interface {
	public name: string
	public price: number
	public pic: string
	public stock: number
	public category: Schema.Types.ObjectId
}
