import {Router} from "express";
import Ride from "../models/Ride.js";
import {faker} from "@faker-js/faker/locale/nl";

const router = Router();

router.get('/', async (req, res) => {
    const rides = await Ride.find({}, '-description');

    const collection = {
        items: rides,
        _links: {
            self: {
                href: `${process.env.BASE_URI}/rides`
            },
            collection: {
                href: `${process.env.BASE_URI}/rides`
            }
        }
    }

    res.json(collection);
});

router.post('/', async (req, res, next) => {
    if (req.body?.method && req.body.method === "SEED") {
        if (req.body?.reset ?? "true" === "true") {
            await Ride.deleteMany({});
        }

        const amount = req.body?.amount ?? 10;

        const rides = [];

        for (let i = 0; i < amount; i++) {
            const ride = Ride({
                name: faker.lorem.sentence(3),
                category: faker.vehicle.vehicle(),
                description: faker.lorem.paragraph()
            });

            rides.push(ride);
            await ride.save();
        }

        res.status(201).json(rides);
    } else {
        next();
    }
});

router.post('/', async (req, res) => {
    if (req.body?.name && req.body?.category && req.body?.description) {
        const ride = Ride({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description

        });
        await ride.save();

        res.status(201).json(ride);
    } else {
        res.status(422).json({
            message: 'Body should contain a name, category and description'
        });
    }
});

router.options('/', (req, res) => {
    res.header("Allow", "GET, POST, OPTIONS")
        .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        .header("Access-Control-Allow-Headers", "Accept, Content-Type")
        .status(204).send();
})

router.get('/:id', async (req, res) => {
    const rideId = req.params.id;

    try {
        const ride = await Ride.findById(rideId);

        if (ride) {
            res.json(ride);
        } else {
            res.status(404).json({
                message: 'Ride not found'
            });
        }
    } catch (e) {
        res.status(404).json({
            message: 'Ride not found'
        });
    }
});

router.put('/:id', async (req, res) => {
    const rideId = req.params.id;

    if (!req.body?.name || !req.body?.category || !req.body?.description) {
        return res.status(422).json({
            message: 'Body should contain a name, category and description'
        });
    }

    try {
        const ride = await Ride.findByIdAndUpdate(
            rideId,
            {
                name: req.body.name,
                category: req.body.category,
                description: req.body.description
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!ride) {
            return res.status(404).send();
        }

        res.json(ride);
    } catch (e) {
        res.status(400).json({
            message: 'Invalid ride id'
        });
    }
});

router.delete('/:id', async (req, res) => {
    const rideId = req.params.id;

    try {
        const ride = await Ride.findByIdAndDelete(rideId);

        if (!ride) {
            return res.status(404).json({
                message: 'Ride not found'
            });
        }

        res.status(204).send();
    } catch (e) {
        res.status(400).json({
            message: 'Invalid ride id'
        });
    }
});

router.options('/:id', (req, res) => {
    res.header("Allow", "GET, PUT, DELETE, OPTIONS")
        .header("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS")
        .header("Access-Control-Allow-Headers", "Accept, Content-Type")
        .status(204).send();
})

export default router;