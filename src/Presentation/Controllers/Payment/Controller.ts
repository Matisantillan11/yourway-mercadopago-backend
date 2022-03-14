import { Router, Response, NextFunction, Request } from 'express'
import { Model, Document } from 'mongoose'
import { injectable, inject, named } from 'inversify'
import mercadopago from 'mercadopago'

import TYPES from '@src/TYPES'
import container from './../../../inversify.config'

import Routeable from '../Ports/Routeable'
import Patheable from '../Ports/Patheable'
import Responseable from '../Responseable'
import DomainResponseable from '@Domain/Entities/Util/Ports/Responseable'

import RequestWithUser from '@Presentation/Ports/RequestWithUser'

import Authenticateable from '@Presentation/Middlewares/Ports/Authenticateable'
import Authorizeable from '@Presentation/Middlewares/Ports/Authorizeable'

import ConnectionableProvider from '@Infrastructure/Persistence/Ports/ConnectionableProvider'

import Validateable from '@Domain/Middleware/Ports/Validateable'
import Schemable from '@Domain/Entities/Util/Ports/Schemable'
import Validable from '@Domain/Entities/Util/Ports/Validable'

import Dto from '@Domain/Entities/Payment/Dto'
import ObjInterface from '@Domain/Entities/Payment/Interface'
import Serviceable from '@Domain/Entities/Payment/Ports/Serviceable'
import SendeableMail from '../../../Application/Mail/Ports/SendeableMail'

@injectable()
export default class Controller implements Routeable, Patheable {
	public router: Router = container.get<Router>(TYPES.Router)
	public path: string = '/payment'
	private validationProvider: Validateable = container.get<Validateable>(
		TYPES.Validateable,
	)
	private authMid: Authenticateable = container.get<Authenticateable>(
		TYPES.Authenticateable,
	)
	private authoMid: Authorizeable = container.get<Authorizeable>(
		TYPES.Authorizeable,
	)
	@inject(TYPES.ConnectionableProvider)
	private connectionProvider: ConnectionableProvider
	@inject(TYPES.Responseable) private responserService: Responseable

	@inject(TYPES.Validable) @named(TYPES.Payment) private dto: Validable
	@inject(TYPES.Schemable) @named(TYPES.Payment) private schema: Schemable
	@inject(TYPES.Schemable) @named(TYPES.User) private userSchema: Schemable
	@inject(TYPES.PaymentServiceableDomain) private service: Serviceable

	@inject(TYPES.UserServiceableDomain) private userService: Serviceable

	@inject(TYPES.SendeableMail) private sendMailController: SendeableMail

	constructor() {
		this.initializeRoutes(this.validationProvider)
	}

	initializeRoutes(validationProvider: Validateable) {
		this.router
			.get(`${this.path}/withauth/:db`, [], this.getAllObjsWithoutAuth)
			.get(this.path, [this.authMid.authenticate], this.getAllObjs)
			.get(
				`${this.path}/:id`,
				[this.authMid.authenticate, validationProvider.validate(Dto, true)],
				this.getObjById,
			)
			.post(
				`${this.path}/withauth/processPayment/:db`,
				[validationProvider.validate(Dto)],
				this.processPaymentWithAuth,
			)
			.post(
				this.path,
				[
					this.authMid.authenticate,
					this.authoMid.authorice,
					validationProvider.validate(Dto),
				],
				this.saveObj,
			)
			.put(
				`${this.path}/:id`,
				[
					this.authMid.authenticate,
					this.authoMid.authorice,
					validationProvider.validate(Dto, true),
				],
				this.updateObj,
			)
			.delete(
				`${this.path}/:id`,
				[this.authMid.authenticate, this.authoMid.authorice],
				this.deleteObj,
			)
	}

	private getAllObjsWithoutAuth = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const model: Model<Document, {}> = await this.connectionProvider.getModel(
			request.params.db,
			this.schema.name,
			this.schema,
		)

		let aggregations: any = request.query.aggregations || {}

		if (request.query) {
			if (request.query.aggregations) {
				try {
					aggregations = JSON.parse(aggregations)
				} catch (error) {
					error = error
				}
			}
		}

		try {
			const responseService: DomainResponseable = await this.service.getAll(
				model,
				aggregations,
			)
			if (responseService.result) {
				this.responserService.res = {
					result: responseService.result,
					message: responseService.message,
					status: responseService.status,
					error: '',
				}
			} else {
				this.responserService.res = {
					result: [],
					message: responseService.message,
					status: responseService.status,
					error: responseService.error,
				}
			}

			response
				.status(this.responserService.res.status)
				.send(this.responserService.res)
		} catch (error) {
			response.status(500).send({ error })
		}
	}

	private getAllObjs = async (
		request: RequestWithUser,
		response: Response,
		next: NextFunction,
	) => {
		try {
			const model: Model<Document, {}> = await this.connectionProvider.getModel(
				request.database,
				this.schema.name,
				this.schema,
			)

			let aggregations: any = request.query.aggregations || {}

			if (request.query) {
				if (request.query.aggregations) {
					try {
						aggregations = JSON.parse(aggregations)
					} catch (error) {
						error = error
					}
				}
			}

			const responseService: DomainResponseable = await this.service.getAll(
				model,
				aggregations,
			)

			if (responseService.result) {
				this.responserService.res = {
					result: responseService.result,
					message: responseService.message,
					status: responseService.status,
					error: '',
				}
			} else {
				this.responserService.res = {
					result: [],
					message: responseService.message,
					status: responseService.status,
					error: responseService.error,
				}
			}

			response
				.status(this.responserService.res.status)
				.send(this.responserService.res)
		} catch (error) {
			response.status(500).send(this.responserService.res)
		}
	}

	private getObjById = async (
		request: RequestWithUser,
		response: Response,
		next: NextFunction,
	) => {
		try {
			const model: Model<Document, {}> = await this.connectionProvider.getModel(
				request.database,
				this.schema.name,
				this.schema,
			)

			const id: string = request.params.id
			const match = {
				_id: { $oid: id },
			}

			const aggregations = {
				match,
				limit: 1,
				skip: 0,
			}

			const serviceResponse: DomainResponseable = await this.service.getAll(
				model,
				aggregations,
			)
			if (serviceResponse.error) {
				this.responserService.res = {
					result: serviceResponse.result,
					message: serviceResponse.message,
					status: serviceResponse.status,
					error: '',
				}
			} else {
				this.responserService.res = {
					result: [],
					message: serviceResponse.message,
					status: serviceResponse.status,
					error: serviceResponse.error,
				}
			}

			return response
				.status(this.responserService.res.status)
				.send(this.responserService.res)
		} catch (error) {
			response.status(500).send({ error })
		}
	}

	private processPaymentWithAuth = async (
		request: RequestWithUser,
		response: Response,
		next: NextFunction,
	) => {
		let db: any = request.params.db

		var model: Model<Document, {}> = await this.connectionProvider.getModel(
			db,
			this.schema.name,
			this.schema,
		)
		var userModel: Model<Document, {}> = await this.connectionProvider.getModel(
			db,
			this.userSchema.name,
			this.userSchema,
		)
		//var saleModel: Model<Document, {}> = await this.connectionProvider.getModel(db, this.saleSchema.name, this.saleSchema)
		//var informationModel: Model<Document, {}> = await this.connectionProvider.getModel(db, this.informationSchema.name, this.informationSchema)

		var id = ''
		// const item = request.body.item
		// const quantity = request.body.quantity
		const aggregations = {
			match: {
				operationType: { $ne: 'D' },
				email: 'nueve@copas.com',
			},
			limit: 1,
			skip: 0,
		}
		const userResponse = await this.userService.getAll(userModel, aggregations)
		if (Object.entries(userResponse.result).length > 0) {
			id = userResponse.result._id
		}

		console.log('process_payment_withAuth')
		console.log(request.body)

		mercadopago.configurations.setAccessToken(
			'APP_USR-6458932831156181-042215-1f5081697ad7e917e588a81d059956a4-711365939',
		)

		let informationList /* : Information[] */ = request.body.informationList

		var payment_data = {
			transaction_amount: Number(request.body.transactionAmount),
			token: request.body.token,
			description: request.body.description,
			installments: Number(request.body.installments),
			payment_method_id: request.body.paymentMethodId,
			payer: {
				email: request.body.email,
				identification: {
					type: request.body.docType,
					number: request.body.docNumber,
				},
			},
		}

		const mp = await mercadopago.payment
			.save(payment_data)
			.then(async (resReturn) => {
				console.log(resReturn)

				let data: any = resReturn.response

				data.idMeli = data.id
				data.isPayment = true
				delete data.id

				let status = resReturn.response.status
				let status_detail = resReturn.response.status_detail
				let msg = this.state(
					resReturn.response.status_detail,
					resReturn.response.statement_descriptor,
					resReturn.response.payment_method_id,
					resReturn.response.installments,
					resReturn.response.status,
					resReturn.response.status_detail,
				)

				let from: string = 'info@nuevecopas.com'
				let pass: string = 'nuevecopas2021'
				let to: string = request.body.email

				if (status === 'approved' || status_detail === 'accredited') {
					informationList.map((information: { _id: string }) => {
						let informationUpdate = { isCheckout: true }
						/* this.informationService.update(information._id, informationUpdate, informationModel, id) */
					})

					// éxito de pago
					if (from !== undefined && pass !== undefined) {
						this.sendMailController
							.sendMail(
								'info@nuevecopas.com',
								request.body.description,
								'consultas@nuevecopas.com',
								'nuevecopas2021',
								'Nueve Copas - Nueva compra desde la tienda',
							)
							.then((res) => {
								console.log(res)
							})
							.catch((err) => {
								console.log(err)
							})

						this.sendMailController
							.sendMail(
								'jsantamaria@nuevecopas.com ',
								request.body.description,
								'consultas@nuevecopas.com',
								'nuevecopas2021',
								'Nueve Copas - Nueva compra desde la tienda',
							)
							.then((res) => {
								console.log(res)
							})
							.catch((err) => {
								console.log(err)
							})

						this.sendMailController
							.sendMail(
								to,
								`<!DOCTYPE html>
							<html lang="en">
							<head>
								<meta charset="UTF-8">
								<meta name="viewport" content="width=device-width, initial-scale=1.0">
								<title>Club de vinos</title>
							<body>
								<a href="${'https://nuevecopas.com'}">
									<div>
										<img src="https://api.nuevecopas.com/image/compraExitosa.jpg" alt="Club de vinos" style="width: 600px;">
									</div>
								</a>
							</body>
							</html>`,
								from,
								pass,
								'Nueve Copas - Nueva compra',
							)
							.then((res) => {
								console.log(res)
							})
							.catch((err) => {
								console.log(err)
							})
					} else {
						console.log('from or pass is undefined')
					}
				} else {
					// pago fallido
					if (from !== undefined && pass !== undefined) {
						this.sendMailController
							.sendMail(
								to,
								`<!DOCTYPE html>
							<html lang="en">
							<head>
								<meta charset="UTF-8">
								<meta name="viewport" content="width=device-width, initial-scale=1.0">
								<title>Club de vinos</title>
							<body>
								<a href="${'https://nuevecopas.com'}">
									<div>
										<img src="https://api.nuevecopas.com/image/errorPago.jpg" alt="Club de vinos" style="width: 600px;">
									</div>
								</a>
							</body>
							</html>`,
								from,
								pass,
								'Nueve Copas - Proceso de pago fallido',
							)
							.then((res) => {
								console.log(res)
							})
							.catch((err) => {
								console.log(err)
							})
					} else {
						console.log('from or pass is undefined')
					}
				}

				const savePayment: DomainResponseable = await this.service.save(
					data,
					model,
					id,
				)
				if (savePayment.result) {
					this.responserService.res = {
						result: {
							...savePayment.result,
							payment: resReturn.response,
						},
						message: savePayment.message,
						status: savePayment.status,
						error: savePayment.error,
					}
				} else {
					this.responserService.res = {
						result: savePayment.result,
						message: savePayment.message,
						status: savePayment.status,
						error: savePayment.error,
					}
				}
			})
			.catch(function (error) {
				console.log(error)
				console.log(new Date().toString())
				this.responserService.res = {
					result: new Date().toString(),
					message: 'Respuesta de mercadopago',
					error: error,
					status: 500,
				}
			})

		if (
			this.responserService &&
			this.responserService.res &&
			this.responserService.res.status
		) {
			response
				.status(this.responserService.res.status)
				.send(this.responserService.res)
		} else {
			response.status(500).send(this.responserService.res)
		}
	}

	private saveObj = async (
		request: RequestWithUser,
		response: Response,
		next: NextFunction,
	) => {
		try {
			const model: Model<Document, {}> = await this.connectionProvider.getModel(
				request.database,
				this.schema.name,
				this.schema,
			)

			const objData: ObjInterface = request.body
			const id = request.user._id

			const responseService = await this.service.save(objData, model, id)
			if (responseService.result) {
				this.responserService.res = {
					result: responseService.result,
					message: responseService.message,
					status: responseService.status,
					error: '',
				}
			} else {
				this.responserService.res = {
					result: responseService.result,
					message: responseService.message,
					error: responseService.error,
					status: responseService.status,
				}
			}

			response
				.status(this.responserService.res.status)
				.send(this.responserService.res)
		} catch (error) {
			response.status(500).send({ error })
		}
	}

	private updateObj = async (
		request: RequestWithUser,
		response: Response,
		next: NextFunction,
	) => {
		try {
			const model: Model<Document, {}> = await this.connectionProvider.getModel(
				request.database,
				this.schema.name,
				this.schema,
			)

			const id: string = request.params.id
			const objData: ObjInterface = request.body
			const idUser: string = request.user._id

			const match = {
				_id: { $oid: id },
			}

			const aggregations = {
				match,
				limit: 1,
				skip: 0,
			}

			const responseService: DomainResponseable = await this.service.getAll(
				model,
				aggregations,
			)

			if (responseService.status === 200) {
				const updateResponse: DomainResponseable = await this.service.update(
					id,
					objData,
					model,
					idUser,
				)
				this.responserService.res = {
					result: updateResponse.result,
					message: updateResponse.message,
					status: updateResponse.status,
					error: '',
				}
			} else {
				this.responserService.res = {
					result: responseService.result,
					message: responseService.message,
					error: responseService.error,
					status: responseService.status,
				}
			}

			response
				.status(this.responserService.res.status)
				.send(this.responserService.res)
		} catch (error) {
			response.status(500).send({ error })
		}
	}

	private deleteObj = async (
		request: RequestWithUser,
		response: Response,
		next: NextFunction,
	) => {
		try {
			const model: Model<Document, {}> = await this.connectionProvider.getModel(
				request.database,
				this.schema.name,
				this.schema,
			)

			const id: string = request.params.id
			const idUser: string = request.user._id

			const match = {
				_id: { $oid: id },
			}

			const aggregations = {
				match,
				limit: 1,
				skip: 0,
			}

			const responseService: DomainResponseable = await this.service.getAll(
				model,
				aggregations,
			)
			if (responseService.result) {
				let obj = responseService.result
				obj.operationType = 'D'

				const deleteResponse = await this.service.update(id, obj, model, idUser)
				this.responserService.res = {
					result: deleteResponse.result,
					message: deleteResponse.message,
					error: deleteResponse.error,
					status: deleteResponse.status,
				}
			} else {
				this.responserService.res = {
					result: responseService.result,
					message: responseService.message,
					error: responseService.error,
					status: responseService.status,
				}
			}

			response
				.status(this.responserService.res.status)
				.send(this.responserService.res)
		} catch (error) {
			response.status(500).send({ error })
		}
	}

	private state = (
		amount: string,
		statement_descriptor: string,
		payment_method_id: string,
		installments: string,
		status: string,
		status_detail: string,
	) => {
		let state: any = {
			approved: {
				accredited: `¡Listo! Se acreditó tu pago. En tu resumen verás el cargo de ${amount} como ${statement_descriptor}. Tu pedido será entregado en las próximas 72 horas hábiles.`,
			},
			in_process: {
				pending_contingency: `Estamos procesando tu pago. No te preocupes, menos de 2 días hábiles te avisaremos por e-mail si se acreditó.`,
				pending_review_manual: `Estamos procesando tu pago. No te preocupes, menos de 2 días hábiles te avisaremos por e-mail si se acreditó o si necesitamos más información.`,
			},
			rejected: {
				cc_rejected_bad_filled_card_number: `Revisa el número de tarjeta.`,
				cc_rejected_bad_filled_date: `Revisa la fecha de vencimiento.`,
				cc_rejected_bad_filled_other: `Revisa los datos.`,
				cc_rejected_bad_filled_security_code: `Revisa el código de seguridad de la tarjeta.`,
				cc_rejected_blacklist: `No pudimos procesar tu pago.`,
				cc_rejected_call_for_authorize: `Debes autorizar ante ${payment_method_id} el pago de ${amount}.`,
				cc_rejected_card_disabled: `Llama a ${payment_method_id} para activar tu tarjeta o usa otro medio de pago. El teléfono está al dorso de tu tarjeta.`,
				cc_rejected_card_error: `No pudimos procesar tu pago.`,
				cc_rejected_duplicated_payment: `Ya hiciste un pago por ese valor. Si necesitas volver a pagar usa otra tarjeta u otro medio de pago.`,
				cc_rejected_high_risk: `Tu pago fue rechazado. Elige otro de los medios de pago, te recomendamos con medios en efectivo.`,
				cc_rejected_insufficient_amount: `Tu ${payment_method_id} no tiene fondos suficientes.`,
				cc_rejected_invalid_installments: `${payment_method_id} no procesa pagos en ${installments} cuotas.`,
				cc_rejected_max_attempts: `Llegaste al límite de intentos permitidos. Elige otra tarjeta u otro medio de pago.`,
				cc_rejected_other_reason: `${payment_method_id} no procesó el pago.`,
			},
		}

		return state[status][status_detail]
	}
}
