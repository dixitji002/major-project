const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;

let listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        
    },
    image: {
       url : String,
       filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});
listSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model('Listing', listSchema);
module.exports = Listing;
