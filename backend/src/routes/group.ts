import express from 'express';
import {Group} from '../database/schema';
import {catchError, notFound} from "../error";

const groupRouter = express.Router();

groupRouter.get('/', async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (e) {
        catchError(e, res);
    }
});

groupRouter.post('/', async (req, res) => {
    const {groupName, description, visibility} = req.body;
    const newGroup = new Group({groupName, description, visibility});

    try {
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (e) {
        catchError(e, res);
    }
});

groupRouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const group = await Group.findById(id);
        if (!group) {
            return notFound(res, 'Group')
        }
        res.json(group);
    } catch (e) {
        catchError(e, res);
    }
});

groupRouter.put('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const updatedGroup = await Group.findByIdAndUpdate(id, req.body, {new: true});
        if (!updatedGroup) {
            return notFound(res, 'Group');
        }
        res.json(updatedGroup);
    } catch (e) {
        catchError(e, res);
    }
});

groupRouter.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const deletedGroup = await Group.findByIdAndDelete(id);
        if (!deletedGroup) {
            return notFound(res, 'Group');
        }
        res.json({message: 'Group deleted'});
    } catch (e) {
        catchError(e, res);
    }
});

export default groupRouter;
