// IMPORT EXPRESS 
const express = require('express');


//IMPORT CONTROLLERS 
const purchaseController = require('../controller/purchasController');
const authController= require("../middleware/authentication")

//CREATE AN INSTANCE OF Router
const router = express.Router();

//CREATE A ROUTER FOR PURCHASINNG
router.get('/premiummembership',authController.auth,purchaseController.premiummembership);
router.post('/updatetransactionstatus',authController.auth,purchaseController.updatetransactionstatus); 

module.exports = router;

