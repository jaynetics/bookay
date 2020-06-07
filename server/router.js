const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const guard = require('./middlewares/guard')
const itemCrud = require('./middlewares/item_crud')
const ctrl = require('./controllers')

// unprotected routes

router.use(express.static('webapp/build'))

router.use(cors())
router.use(bodyParser.json({ limit: '30mb' }))

router.post('/api/login', ctrl.SessionsController.create)
router.delete('/api/logout', ctrl.SessionsController.destroy)
router.post('/api/users', ctrl.UsersController.create) // unprotected for first user

if (process.env.NODE_ENV === 'test') {
  router.post('/api/integration_test', ctrl.IntegrationTestsController.create)
  router.use('/plugin', express.static('../plugin'))
}

// protected routes

router.use(guard())

router.use(itemCrud())

router.get('/api/check/:url', ctrl.ChecksController.show)
router.get('/api/export', ctrl.ExportsController.show)
router.get('/api/health_check', ctrl.HealthChecksController.show)
router.post('/api/items/:id/dissolve', ctrl.DissolutionsController.create)
router.post('/api/imports', ctrl.ImportsController.create)
router.get('/api/stats', ctrl.StatsController.show)

module.exports = router
