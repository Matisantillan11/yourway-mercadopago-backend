const mercadopago = require('../components/mercadopago/network.js')

const routes = (server) => {
    server.use("/api", mercadopago)
}

module.exports = routes