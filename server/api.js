const express = require('express');
const apiRouter = express.Router();
const checkMillionDollarIdea = require('./checkMillionDollarIdea.js');
const { 
    getAllFromDatabase, 
    addToDatabase, 
    getFromDatabaseById,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
    createMeeting,
    deleteAllFromDatabase
 } = require('./db.js');

apiRouter.param("entity", (req, res, next, entity) => {
    const entities = ["minions", "ideas", "meetings", "work"];
    if (!entities.includes(entity)) {
        res.status(404).send(`${entity} is not valid`);
    } else {
        req.entity = entity;
        next();
    }
});

apiRouter.param('id', (req, res, next, id) => {
    const validId = getFromDatabaseById(req.entity, id);
    if (!validId) {
        res.status(404).send(`${id} is not valid`);
    } else {
        req.id = validId;
        next();
    }
});

const applyCheckMillionDollarIdea = (req, res, next) => {
    if (req.entity == "ideas") {
        return checkMillionDollarIdea(req, res, next);
    } else {
        next();
    }
};

apiRouter.get("/:entity", (req, res) => {
    const entity = getAllFromDatabase(req.entity)
    res.send(entity);
});

//apiRouter.post("/meetings", (req, res) => {
//    const newMeeting = createMeeting();
//    res.status(201).send(newMeeting);
//});

apiRouter.post("/:entity", applyCheckMillionDollarIdea, (req, res) => {
    if (req.entity === "meetings") {
        const newMeeting = createMeeting();
        addToDatabase(req.entity, newMeeting);
        res.status(201).send(newMeeting);
    } else {
    const newEntity = addToDatabase(req.entity, req.body);
    res.status(201).send(newEntity);
    }
});

apiRouter.get("/:entity/:id", (req, res) => {
    res.send(req.id);
});

apiRouter.put("/:entity/:id", applyCheckMillionDollarIdea, (req, res) => {
    const newEntity = req.body;
    newEntity.id = req.params.id;
    const updatedEntity = updateInstanceInDatabase(req.entity, newEntity);
    res.status(200).send(updatedEntity);
});

apiRouter.delete("/:entity/:id", (req, res) => {
    deleteFromDatabasebyId(req.entity, req.id.id);
    //res.status(204).send(`Deleted entity ${JSON.stringify(req.id)}`);
    res.status(204).send("No content");
});

apiRouter.delete("/:entity", (req,res) => {
    if (req.entity == "meetings") {
        deleteAllFromDatabase(req.entity);
        res.status(204).send("No content");
    }
});

module.exports = apiRouter;
