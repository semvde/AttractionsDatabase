import {Router} from "express";
import Ride from "../models/Ride.js";
import {faker} from "@faker-js/faker/locale/nl";

const router = Router();

const escapeRegex = (text) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET rides collection
router.get('/', async (req, res) => {
    // Setup filtering
    const filters = {};
    if (req.query.name) {
        filters.name = {
            $regex: escapeRegex(req.query.name),
            $options: 'i'
        };
    }
    if (req.query.area) {
        filters.area = req.query.area;
    }

    // Get page and limit values from URI params
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = req.query.limit ? Math.max(parseInt(req.query.limit), 1) : null;
    const totalItems = await Ride.countDocuments(filters);

    // Setup default query and counts
    let query = Ride.find(filters, '-description').populate('area');

    let totalPages = 1;
    let currentItems = totalItems;

    // If limit param is specified, change query to get <x> items on <x>th page
    if (limit) {
        totalPages = Math.max(Math.ceil(totalItems / limit), 1);

        const currentPage = Math.min(page, totalPages);
        const skip = (currentPage - 1) * limit;

        query = query.skip(skip).limit(limit);
    }

    // Execute query (normal query or paginated query, based on of above if-statement did its thing)
    const rides = await query.exec();
    currentItems = rides.length;

    // Function for constructing URI's with page, limit and filter params
    const buildURI = (p) => {
        const params = new URLSearchParams();

        if (limit) params.append('limit', limit.toString());
        if (limit) params.append('page', p);
        if (req.query.category) params.append('category', req.query.category);

        return `${process.env.BASE_URI}/rides${limit || req.query.category ? '?' : ''}${params.toString()}`;
    };

    const collection = {
        items: rides,
        pagination: {
            currentPage: page,
            currentItems: currentItems,
            totalPages: totalPages,
            totalItems: totalItems,
            _links: {
                first: {
                    page: 1,
                    href: buildURI(1)
                },
                last: {
                    page: totalPages,
                    href: buildURI(totalPages)
                },
                previous: page > 1 && page <= totalPages
                    ? {page: page - 1, href: buildURI(page - 1)}
                    : null,
                next: page < totalPages
                    ? {page: page + 1, href: buildURI(page + 1)}
                    : null
            }
        },
        _links: {
            self: {
                href: buildURI(page)
            },
            collection: {
                href: `${process.env.BASE_URI}/rides`
            }
        }
    }

    res.json(collection);
});

// POST new rides to collection (seeding)
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
                description: faker.lorem.paragraph(),
                area: null
            });

            rides.push(ride);
            await ride.save();
        }

        res.status(201).json(rides);
    } else {
        // If method was not SEED, do normal POST
        next();
    }
});

// POST new ride to collection (singular)
router.post('/', async (req, res) => {
    if (req.body?.name && req.body?.category && req.body?.description) {
        const ride = Ride({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            area: req.body.area || null

        });
        await ride.save();

        res.status(201).json(ride);
    } else {
        res.status(422).json({
            message: 'Body should contain a name, category and description'
        });
    }
});

// OPTIONS for the collection route
router.options('/', (req, res) => {
    res.header("Allow", "GET, POST, OPTIONS")
        .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        .header("Access-Control-Allow-Headers", "Accept, Content-Type")
        .status(204).send();
})

// GET specific ride
router.get('/:id', async (req, res) => {
    const rideId = req.params.id;

    try {
        const ride = await Ride.findById(rideId).populate('area');

        if (!ride) {
            return res.status(404).json({
                message: 'Ride not found'
            });
        }

        const lastModified = ride.updatedAt.toUTCString();
        const ifModifiedSince = req.headers['if-modified-since'];

        if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastModified)) {
            return res.status(304).end();
        }

        res.header('Last-Modified', lastModified)
        res.json(ride);
    } catch (e) {
        res.status(500).json({
            message: 'Server error'
        });
    }
});

// PUT changes on specific ride
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
                description: req.body.description,
                area: req.body.area || null
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

// DELETE specific ride
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

// OPTIONS for the specific ride
router.options('/:id', (req, res) => {
    res.header("Allow", "GET, PUT, DELETE, OPTIONS")
        .header("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS")
        .header("Access-Control-Allow-Headers", "Accept, Content-Type")
        .status(204).send();
})

export default router;