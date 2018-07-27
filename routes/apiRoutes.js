const express = require('express')
const projectModel = require('../data/helpers/projectModel.js');
const actionModel = require('../data/helpers/actionModel.js');

const projectRoutes = require('./projects/projects')
const actionRoutes = require('./actions/actions')

const api = express.Router()


api.use('/projects', projectRoutes)
api.use('/actions', actionRoutes)

module.exports = api