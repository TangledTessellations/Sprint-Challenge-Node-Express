const express = require('express');
const projectModel = require('../../data/helpers/projectModel.js');

const router = express.Router();

const SUCCESS = 200;
const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
const MISSING_NAME_DESCRIPTION = "MISSING_NAME_DESCRIPTION"
const INVALID_PROJECT_ID = "INVALID_PROJECT_ID"

// ******************************  MiddleWare ********************************************

// Checks for project by ID and adds to req.projectIn
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

// ******************************  Projects ********************************************

router.get('/', async (req, res, next) => {
    let error = INTERNAL_SERVER_ERROR

    try{
        const projects = await projectModel.get()
        res.status(SUCCESS).json(projects)
    }catch(err){
        next({error: error, internalError: err.message})
    }
})

router.get('/:id', getProject, (req,res, next) => {
    let error = INTERNAL_SERVER_ERROR

    try{
        res.status(SUCCESS).json(req.projectIn)
    }catch(err){
        next({error: error, internalError: err.message})
    }
})

// Get all actions for a project
router.get('/:id/actions', getProject, async (req, res, next) => {
    let error = INTERNAL_SERVER_ERROR

    try{
        const actions = await projectModel.getProjectActions(req.params.id)
        res.status(SUCCESS).json(actions)
    }catch(err){
        next({error: error, internalError: err.message})
    }
})

router.post('/', async (req, res, next) => {
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

router.put('/:id', getProject, async (req, res, next) => {
    try{
        const updated = {...req.body} 
        await projectModel.update(req.params.id, updated); 
        res.status(SUCCESS).json(updated)
    }catch(err) {
        next({error: INTERNAL_SERVER_ERROR, internalError: err.message})    }
})

router.delete('/:id', getProject, async (req, res, next) => {
    try{
        await projectModel.remove(req.params.id)
        res.status(SUCCESS).json({"Removed": req.projectIn})
        
    }catch(err){
        next({error: INTERNAL_SERVER_ERROR, internalError: err.message})    }
})

module.exports = router
