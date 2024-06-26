import express from 'express';
import {Event} from '../database/schema';
import {getFuzzyFindQuery} from "../routes/queries";
import {catchError, notFound} from "../error";
const verifyToken = require('./verifyToken');

const eventRouter = express.Router();

eventRouter.get('/', verifyToken, async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (e) {
        catchError(e, res);
    }
});

eventRouter.post('/', async (req, res) => {
    const event = new Event({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        address: req.body.address,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        date: req.body.date,
        owner: req.body.owner,
        group: req.body.group,
        visibility: req.body.visibility,
        eventType: req.body.eventType,
        coordinates: req.body.coordinates
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (e) {
        catchError(e, res);
    }
});

eventRouter.delete('/', async (req, res) => {
    try {
        await Event.deleteMany({});
        res.status(200).json({ message: 'All events cleared successfully.' });
    } catch (e) {
        catchError(e, res);
    }
});

eventRouter.get('/search', async (req, res) => {
    const { query } = req.query as any;

    const pipeline = [
        {
            $search: {
                index: "EventAutoComplete",
                autocomplete: {
                    query: query,
                    path: "name"
                }
            },
        }
    ];

    //Sort descending order
    const result = await Event.aggregate(pipeline).sort({score:-1});
    res.status(200).json(result);
});

eventRouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return notFound(res, 'Event');
        }
        res.json(event);
    } catch (e) {
        catchError(e, res);
    }
});


eventRouter.put('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {new: true});
        if (!updatedEvent) {
            return notFound(res, 'Event');
        }
        res.json(updatedEvent);
    } catch (e) {
        catchError(e, res);
    }
});

eventRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEvent = await Event.findOneAndDelete({ _id: id });
        if (!deletedEvent) {
            return notFound(res, 'Event');
        }
        res.json({ message: 'Event deleted' });
    } catch (e) {
        catchError(e, res);
    }
});

export default eventRouter;
