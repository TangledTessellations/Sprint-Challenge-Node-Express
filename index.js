const express = require('express');
const helmet = require('helmet');
const apiRoutes = require('./routes/apiRoutes.js');
const projectModel = require('./data/helpers/projectModel.js');
const actionModel = require('./data/helpers/actionModel.js');

const server = express()

server.get('/', (req, res) => res.send('API running on port 8000'))

server.use('/api', apiRoutes)

server.listen(8000, () => console.log('API running on port 8000'))


const SUCCESS = 200;
server.use(express.json())
server.use(helmet())

const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
const INVALID_ACTION_ID = "INVALID_ACTION_ID"
const MISSING_NAME_DESCRIPTION = "MISSING_NAME_DESCRIPTION"
const MISSING_DESCRIPTION_NOTES = "MISSING_DESCRIPTION_NOTES"
const INVALID_PROJECT_ID = "INVALID_PROJECT_ID"




// ******************************  Error Handler ********************************************

server.use(( err, req, res, next ) => {
    switch(err.error) {
        case MISSING_NAME_DESCRIPTION:
            res.status(400).send({
                success: false,
                description: "Please include a valid name and description",
                internal_error: err.internalError 
            })
        case MISSING_DESCRIPTION_NOTES:
            res.status(400).send({
                success: false,
                description: "Please include a valid description and notes for the Action",
                internal_error: err.internalError 
            })
        case INVALID_PROJECT_ID:
            res.status(400).send({
                success: false,
                description: "No project by that ID",
                internal_error: err.internalError
            })
        case INVALID_ACTION_ID:
            res.status(400).send({
                success: false,
                description: "No action by that ID",
                internal_error: err.internalError
            })
        case INTERNAL_SERVER_ERROR:
            res.status(500).send({
                success: false,
                description: "Internal Server Error",
                internal_error: err.internalError
            })
    }
})
