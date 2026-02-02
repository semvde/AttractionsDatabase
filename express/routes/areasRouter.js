import {Router} from "express";
import Area from "../models/Area.js";
import {faker} from "@faker-js/faker/locale/nl";

const router = Router();

// GET areas collection
router.get('/', async (req, res) => {
    // Get page and limit values from URI params
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = req.query.limit ? Math.max(parseInt(req.query.limit), 1) : null;
    const totalItems = await Area.countDocuments();

    // Setup default query and counts
    let query = Area.find({});

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
    const areas = await query.exec();
    currentItems = areas.length;

    // Function for constructing URI's with page and limit params
    const buildURI = (p) => {
        const params = new URLSearchParams();

        if (limit) params.append('limit', limit.toString());
        if (limit) params.append('page', p);

        return `${process.env.BASE_URI}/areas${limit || req.query.category ? '?' : ''}${params.toString()}`;
    };

    const collection = {
        items: areas,
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
                href: `${process.env.BASE_URI}/areas`
            }
        }
    }

    res.json(collection);
});

// POST new areas to collection (seeding)
router.post('/', async (req, res, next) => {
    if (req.body?.method && req.body.method === "SEED") {
        if (req.body?.reset ?? "true" === "true") {
            await Area.deleteMany({});
        }

        const amount = req.body?.amount ?? 10;

        const areas = [];

        for (let i = 0; i < amount; i++) {
            const area = Area({
                name: faker.lorem.sentence(3),
            });

            areas.push(area);
            await area.save();
        }

        res.status(201).json(areas);
    } else {
        // If method was not SEED, do normal POST
        next();
    }
});

// POST new area to collection (singular)
router.post('/', async (req, res) => {
    if (req.body?.name) {
        const area = Area({
            name: req.body.name,

        });
        await area.save();

        res.status(201).json(area);
    } else {
        res.status(422).json({
            message: 'Body should contain a name'
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

// GET specific area
router.get('/:id', async (req, res) => {
    const areaId = req.params.id;

    try {
        const area = await Area.findById(areaId);

        if (area) {
            res.json(area);
        } else {
            res.status(404).json({
                message: 'Area not found'
            });
        }
    } catch (e) {
        res.status(404).json({
            message: 'Area not found'
        });
    }
});

// PUT changes on specific area
router.put('/:id', async (req, res) => {
    const areaId = req.params.id;

    if (!req.body?.name) {
        return res.status(422).json({
            message: 'Body should contain a name'
        });
    }

    try {
        const area = await Area.findByIdAndUpdate(
            areaId,
            {
                name: req.body.name,
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!area) {
            return res.status(404).send();
        }

        res.json(area);
    } catch (e) {
        res.status(400).json({
            message: 'Invalid area id'
        });
    }
});

// DELETE specific area
router.delete('/:id', async (req, res) => {
    const areaId = req.params.id;

    try {
        const area = await Area.findByIdAndDelete(areaId);

        if (!area) {
            return res.status(404).json({
                message: 'Area not found'
            });
        }

        res.status(204).send();
    } catch (e) {
        res.status(400).json({
            message: 'Invalid area id'
        });
    }
});

// OPTIONS for the specific area
router.options('/:id', (req, res) => {
    res.header("Allow", "GET, PUT, DELETE, OPTIONS")
        .header("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS")
        .header("Access-Control-Allow-Headers", "Accept, Content-Type, If-Modified-Since")
        .status(204).send();
})

export default router;