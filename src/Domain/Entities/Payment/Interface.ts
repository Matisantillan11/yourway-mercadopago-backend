import InterfaceUtil from '@Domain/Entities/Util/Ports/Dtoable'

export default interface Interface extends InterfaceUtil {
	name: string
	amountMeli: string
	discountMeli: string
	totalMeli: string
	operationNumberMeli: string
	statusMeli: string
	ejectMeli: Date
	paymentMethodMeli: string
	barcodeMeli: string
	transactionNumbreMeli: string
	finalCollectorMeli: string
}
