import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
        name: {type: String, required: true},
        category: {type: String, required: true},
        description: {type: String, required: true},
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `${process.env.BASE_URI}/rides/${ret._id}`,
                    },
                    collection: {
                        href: `${process.env.BASE_URI}/rides`,
                    },
                };

                delete ret._id;
            },
        },
    });

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;