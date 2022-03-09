import Registrable from '@Domain/Entities/Registrable'
import OperationableType from '@Domain/Entities/OperationableType'
import Identificable from '@Domain/Entities/Identificable'
import Observationable from '@Domain/Entities/Observationable'

export default interface Interface
	extends Registrable,
		OperationableType,
		Identificable,
		Observationable {}
