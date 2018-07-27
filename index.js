const express = require('express');
const helmet = require('helmet');
const projectModel = require('./data/helpers/projectModel.js');
const actionModel = require('./data/helpers/actionModel.js');

const server = express()

server.listen(8000, () => console.log('API running on port 8000'))


const SUCCESS = 200;
server.use(express.json())
server.use(helmet())

const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
const INVALID_ACTION_ID = "INVALID_ACTION_ID"
const MISSING_NAME_DESCRIPTION = "MISSING_NAME_DESCRIPTION"
const MISSING_DESCRIPTION = "MISSING_DESCRIPTION"
const MISSING_TAG = "MISSING_TAG"
const INVALID_PROJECT_ID = "INVALID_PROJECT_ID"
const INVALID_TAG_ID = "INVALID_TAG_ID"

// ******************************  MiddleWare ********************************************

// Checks for user by ID and adds to req.userIn
// Use to confirm valid user
const getProject = async (req, res, next) => {
    const { id } = req.params
    const { project_id } = req.body
    let error = INVALID_PROJECT_ID

    try{
        const projectIn = await projectModel.get(id || project_id)
        if(!projectIn){ throw Error() }
        error = INTERNAL_SERVER_ERROR

        req.projectIn = projectIn

        next();
    }catch(err){
        next({error: error, internalError: err.message})    }
}

// local middleware checks for specific action by ID and adds to req.actionIn
// Use to confirm we have a valid action
const getAction = async (req, res, next) => {
    let { id } = req.params
    let error = INVALID_ACTION_ID
    
    try{
        const actionIn = await actionModel.get(id)
        if(!actionIn){ throw Error() }
        error = INTERNAL_SERVER_ERROR
        req.actionIn = actionIn  

        next();
    }catch(err){
        next({error: error, internalError: err.message})
    }
}


// ******************************  Projects ********************************************

server.get('/api/projects', async (req, res, next) => {
    let error = INTERNAL_SERVER_ERROR

    try{
        const projects = await projectModel.get()
        res.status(SUCCESS).json(projects)
    }catch(err){
        next({error: error, internalError: err.message})
    }
})

server.get('/api/projects/:id', getProject, (req,res, next) => {
    let error = INTERNAL_SERVER_ERROR

    try{
        res.status(SUCCESS).json(req.projectIn)
    }catch(err){
        next({error: error, internalError: err.message})
    }
})

// Get all actions for a project
server.get('/api/projects/:id/actions', getProject, async (req, res, next) => {
    let error = INTERNAL_SERVER_ERROR

    try{
        const actions = await projectModel.getProjectActions(req.params.id)
        res.status(SUCCESS).json(actions)
    }catch(err){
        next({error: error, internalError: err.message})
    }
})

server.post('/api/projects', async (req, res, next) => {
    const { name, description } = req.body
    let error = MISSING_NAME_DESCRIPTION 

    try{
        if(!name || !description){ throw Error() }   // throw if missing information

        const projectOut = {...req.body}
        error = INTERNAL_SERVER_ERROR           

        const response = await projectModel.insert(projectOut)
        res.status(SUCCESS).json(response)
    }catch(err){
        next({error: error, internalError: err.message})    }
})

server.put('/api/projects/:id', getProject, async (req, res, next) => {
    try{
        const updated = {...req.body} 
        await projectModel.update(req.params.id, updated); 
        res.status(SUCCESS).json(updated)
    }catch(err) {
        next({error: INTERNAL_SERVER_ERROR, internalError: err.message})    }
})

server.delete('/api/projects/:id', getProject, async (req, res, next) => {
    try{
        await projectModel.remove(req.params.id)
        res.status(SUCCESS).json({"Removed": req.projectIn})
        
    }catch(err){
        next({error: INTERNAL_SERVER_ERROR, internalError: err.message})    }
})




// ******************************  Actions ********************************************

server.get('/api/actions', async (req, res, next) => {
    let error = INTERNAL_SERVER_ERROR

    try{
        const actions = actionModel.get()
        res.status(SUCCESS).json(actions)
    }catch(err){
        next({error: error, internalError: err.message})    }
})

server.get('/api/actions/:id', getAction, async (req, res, next) => {
    // getAction validates and assigns action to req.actionIn
    let error = INTERNAL_SERVER_ERROR

    try{
        res.status(SUCCESS).json(req.actionIn)
    }catch(err){
        next({error: error, internalError: err.message})    }
})

server.post('/api/actions', getProject, async (req, res, next) => {
    const { description } = req.body
    let error = MISSING_DESCRIPTION

    try{
        if( !description ){ throw Error() }
        error = INTERNAL_SERVER_ERROR

        const newAction = {...req.body}
        await actionModel.insert(newAction)
        res.status(SUCCESS).json(newAction)
    }catch(err){
        next({error: error, internalError: err.message})    }
})

server.put('/api/actions/:id', getAction, async (req, res, next) => {
    try{
        const updated = {...req.body}
        await actionModel.update(req.params.id, updated)
        res.status(SUCCESS).json(updated)
    }catch(err){
        next({error: INTERNAL_SERVER_ERROR, internalError: err.message})    }
})

server.delete('/api/actions/:id', getAction, async (req, res, next) => {
    try{
        await actionModel.remove(req.params.id)
        res.status(SUCCESS).json({"Removed": req.actionIn})
    }catch(err){
        next({error: INTERNAL_SERVER_ERROR, internalError: err.message})    }
})



// ******************************  Error Handler ********************************************

server.use(( err, req, res, next ) => {
    switch(err.error) {
        case MISSING_NAME_DESCRIPTION:
            res.status(400).send({
                success: false,
                description: "Please include a valid name and description",
                internal_error: err.internalError 
            })
        case MISSING_DESCRIPTION:
            res.status(400).send({
                success: false,
                description: "Please include a valid description for the Action",
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
