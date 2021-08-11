const express = require("express");

const app = express();

//mp
const mercadopago = require ('mercadopago');
// Agrega credenciales
mercadopago.configure({
  access_token: "APP_USR-1211955142597430-081120-95fdef3e3088b5aebdf71c968b8120e9-806110258"
});


app.post("/checkout", (req, res) => {
    //preference
    // Crea un objeto de preferencia
    let preference = {
        items: [
        {
            title: "Producto Test 1",
            unit_price: 250,
            quantity: 2,
        }
        ]
    };
    
    mercadopago.preferences.create(preference)
    .then((response) => {
        global.id = response.body.id
        res.redirect(response.body.init_point)
    }).catch((error) => {
        console.log(error);
    });

  
})

//server 

app.listen(3001, () =>{
    console.log("Server start on port 3001")
});