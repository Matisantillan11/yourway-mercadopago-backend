import { injectable } from 'inversify'

import DtoUtil from '@Domain/Entities/Util/Ports/Dto'
import Interface from './Interface'

@injectable()
export default class EntityDto extends DtoUtil implements Interface {
	public name: string
	public amountMeli: string
	public discountMeli: string
	public totalMeli: string
	public operationNumberMeli: string
	public statusMeli: string
	public ejectMeli: Date
	public paymentMethodMeli: string
	public barcodeMeli: string
	public transactionNumbreMeli: string
	public finalCollectorMeli: string
}
