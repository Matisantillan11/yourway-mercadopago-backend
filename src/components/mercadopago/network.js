const express = require("express");
const createReference = require("./config");

const router = express.Router();


router.post("/mercado-pago/checkout", async (req, res) => {
   console.log(req.body)
    
    const uri = await createReference(req.body);
    res.redirect(uri)
    
}); 


module.exports = router;