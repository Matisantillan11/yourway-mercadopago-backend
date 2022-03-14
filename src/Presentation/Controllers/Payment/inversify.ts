import TYPES from '@src/TYPES'
import { Container } from "inversify";
import "reflect-metadata";

import Schemable from '@Domain/Entities/Util/Ports/Schemable'
import Validable from '@Domain/Entities/Util/Ports/Validable'
import Routeable from '@Presentation/Controllers/Ports/Routeable'

import PaymentServiceableDomain from '@Domain/Entities/Payment/Ports/Serviceable'
import PaymentInterface from '@Domain/Entities/Payment/Interface'
import PaymentModel from '@Domain/Entities/Payment/Model'
import PaymentServiceDomain from '@Domain/Entities/Payment/Controller'
import PaymentDto from '@Domain/Entities/Payment/Dto'
import PaymentServicePresentation from '@Presentation/Controllers/Payment/Controller'

var container = new Container()
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new PaymentModel).whenTargetNamed(TYPES.Payment)
container.bind<Validable>(TYPES.Validable).to(PaymentDto).whenTargetNamed(TYPES.Payment)
container.bind<PaymentInterface>(TYPES.PaymentInterface).toConstantValue(new PaymentDto)
container.bind<PaymentServiceableDomain>(TYPES.PaymentServiceableDomain).to(PaymentServiceDomain)
container.bind<Routeable>(TYPES.Routeable).to(PaymentServicePresentation)

export default container
