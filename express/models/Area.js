import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
        name: {type: String, required: true},
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `${process.env.BASE_URI}/areas/${ret._id}`,
                    },
                    collection: {
                        href: `${process.env.BASE_URI}/areas`,
                    },
                };

                delete ret._id;
            },
        },
    });

const Area = mongoose.model("Area", areaSchema);

export default Area;