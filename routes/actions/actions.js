const express = require('express');
const projectModel = require('../../data/helpers/projectModel.js');
const actionModel = require('../../data/helpers/actionModel.js');

const router = express.Router();

const SUCCESS = 200;
const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
const INVALID_ACTION_ID = "INVALID_ACTION_ID"
const MISSING_DESCRIPTION_NOTES = "MISSING_DESCRIPTION_NOTES"
const INVALID_PROJECT_ID = "INVALID_PROJECT_ID"

// ******************************  MiddleWare ********************************************

// Checks for project by ID and adds to req.projectIn
// Use to confirm valid user
const getProject = async (req, res, next) => {
    const { project_id } = req.body
    let error = INVALID_PROJECT_ID

    try{
        const projectIn = await projectModel.get(project_id)
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


// ******************************  Actions ********************************************

router.get('/', async (req, res, next) => {
    let error = INTERNAL_SERVER_ERROR

    try{
        const actions = await actionModel.get()
        res.status(SUCCESS).json(actions)
    }catch(err){
        next({error: error, internalError: err.message})    }
})

router.get('/:id', getAction, async (req, res, next) => {
    // getAction validates and assigns action to req.actionIn
    let error = INTERNAL_SERVER_ERROR

    try{
        res.status(SUCCESS).json(req.actionIn)
    }catch(err){
        next({error: error, internalError: err.message})    }
})

router.post('/', getProject, async (req, res, next) => {
    const { description, notes } = req.body
    let error = MISSING_DESCRIPTION_NOTES

    try{
        if( !description || ! notes){ throw Error() }
        error = INTERNAL_SERVER_ERROR

        const newAction = {...req.body}
        await actionModel.insert(newAction)
        res.status(SUCCESS).json(newAction)
    }catch(err){
        next({error: error, internalError: err.message})    }
})

router.put('/:id', getAction, getProject, async (req, res, next) => {
    try{
        const updated = {...req.body}
        await actionModel.update(req.params.id, updated)
        res.status(SUCCESS).json(updated)
    }catch(err){
        next({error: INTERNAL_SERVER_ERROR, internalError: err.message})    }
})

router.delete('/:id', getAction, async (req, res, next) => {
    try{
        await actionModel.remove(req.params.id)
        res.status(SUCCESS).json({"Removed": req.actionIn})
    }catch(err){
        next({error: INTERNAL_SERVER_ERROR, internalError: err.message})    }
})

module.exports = router