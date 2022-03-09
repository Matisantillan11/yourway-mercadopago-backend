import TYPES from '@src/TYPES'
import { Container } from "inversify";
import "reflect-metadata";

import Schemable from '@Domain/Entities/Util/Ports/Schemable'
import Validable from '@Domain/Entities/Util/Ports/Validable'
import Routeable from '@Presentation/Controllers/Ports/Routeable'

import ProductServiceableDomain from '@Domain/Entities/Product/Ports/Serviceable'
import ProductInterface from '@Domain/Entities/Product/Interface'
import ProductModel from '@Domain/Entities/Product/Model'
import ProductServiceDomain from '@Domain/Entities/Product/Controller'
import ProductDto from '@Domain/Entities/Product/Dto'
import ProductServicePresentation from '@Presentation/Controllers/Product/Controller'

var container = new Container()
container.bind<Schemable>(TYPES.Schemable).toConstantValue(new ProductModel).whenTargetNamed(TYPES.Product)
container.bind<Validable>(TYPES.Validable).to(ProductDto).whenTargetNamed(TYPES.Product)
container.bind<ProductInterface>(TYPES.ProductInterface).toConstantValue(new ProductDto)
container.bind<ProductServiceableDomain>(TYPES.ProductServiceableDomain).to(ProductServiceDomain)
container.bind<Routeable>(TYPES.Routeable).to(ProductServicePresentation)

export default container
