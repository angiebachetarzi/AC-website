const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const authorize = require('_middleware/authorize')
const validateRequest = require('_middleware/validate-request');
const designService = require('./design.service');

// routes
router.get('/', getAllDesigns);
router.get('/:design_id', getDesign);
router.get('/getUserDesigns/:creator_id', getUserDesigns);
router.post('/', authorize(), uploadDesignSchema, uploadDesign);
router.put('/:creator_id/:design_ID', authorize(), updateDesignSchema, updateDesign);
router.delete('/:creator_id/:design_ID', authorize(), _delete);

module.exports = router;

function getAllDesigns(req, res, next) {
    designService.getAllDesigns()
        .then(designs => res.json(designs))
        .catch(err => next(err));
}

function getDesign(req, res, next) {
    designService.getDesign(req.params.design_id)
        .then(design => design ? res.json(design) : res.sendStatus(404))
        .catch(err => next(err));
}

function getUserDesigns(req, res, next) {
    designService.getUserDesigns(req.params.creator_id)
        .then(designs => res.json(designs))
        .catch(err => next(err));
}

function uploadDesignSchema(req, res, next) {
    const schema = Joi.object({
        designName: Joi.string().required(),
        creatorID: Joi.string().valid(req.user.creatorID).default(req.user.creatorID),
        designID: Joi.string().pattern(new RegExp('^MO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$')).required(),
        designType: Joi.string().valid('clothes', 'other').required(),
        designImage: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function uploadDesign(req, res, next) {
    designService.uploadDesign(req.body)
        .then(design => res.json(design))
        .catch(err => next(err));
}

function updateDesignSchema(req, res, next) {
    const schemaRules = {
        designName: Joi.string().empty(''),
        creatorID: Joi.string().empty(''),
        designID: Joi.string().empty(''),
        designType: Joi.string().empty(''),
        designImage: Joi.string().empty('')
    };

    const schema = Joi.object(schemaRules);
    validateRequest(req, next, schema);
}

function updateDesign(req, res, next) {

    // users can update only their own designs
    if (req.params.creator_id !== req.user.creatorID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    designService.updateDesign(req.params.design_id, req.body)
        .then(design => res.json(design))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    // users can delete only their own design
    if (req.params.creator_id !== req.user.creatorID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    designService.deleteDesign(req.params.design_id)
        .then(() => res.json({ message: 'Design deleted successfully' }))
        .catch(err => next(err));
}