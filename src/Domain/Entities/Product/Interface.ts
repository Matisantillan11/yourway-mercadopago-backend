import InterfaceUtil from '@Domain/Entities/Util/Ports/Dtoable'

export default interface Interface extends InterfaceUtil {
	name: string
	price: number
	pic: string
	stock: number
}
