const db = require('_helpers/db');
const Design = db.Design;

module.exports = {
    getAllDesigns,
    getDesign,
    getUserDesigns,
    uploadDesign,
    updateDesign,
    deleteDesign
};

async function uploadDesign(params) {

    const design = new Design(params);

    // save design
    await design.save();

    return basicDetails(design);
}

async function getAllDesigns() {
    const designs = await Design.find();
    return designs.map(x => basicDetails(x));
}

async function getDesign(design_id) {
    const design = await getDesign(design_id);
    return basicDetails(design);
}

async function getUserDesigns(creator_id) {
    const designs = await Design.find({ 'creatorID': creator_id });
    return designs.map(x => basicDetails(x));
}

async function updateDesign(design_id, params) {
    const design = await getDesign(design_id);

    // copy params to design and save
    Object.assign(design, params);
    design.dateUpdated = Date.now();
    await design.save();

    return basicDetails(design);
}

async function deleteDesign(design_id) {
    const design = await getDesign(design_id);
    await design.remove();
}

// helper functions

async function getDesign(design_id) {
    const design = await Design.findOne({ 'designID': design_id });
    if (!design) throw 'Design not found';
    return design;
}

function basicDetails(design) {
    const { designName, uploadedBy, creatorID, designID, designType, designImage, dateCreated, dateUpdated } = design;
    return { designName, uploadedBy, creatorID, designID, designType, designImage, dateCreated, dateUpdated };
}