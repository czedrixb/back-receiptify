const express = require("express")
const router = express.Router()
const productController = require('../controllers/productController')
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, productController.getProducts)
router.get('/:id', verifyToken, productController.getProduct)
router.post('/', verifyToken, productController.createProduct)
router.put('/:id', verifyToken, productController.updateProduct)
router.delete('/:id', verifyToken, productController.deleteProduct)

module.exports = router