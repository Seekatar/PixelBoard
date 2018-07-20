use pixelBoard;
db.instruments.aggregate(
    {
        $lookup: {
            from: "instrumenttypes",
            localField: "instrumentType",    // field in the orders collection
            foreignField: "_id",  // field in the items collection
            as: "instruments"
        }
    }
    ,
    {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$instruments", 0] }, "$$ROOT"] } }
    },
    { $project: { instruments: 0 } }
);

db.instruments.aggregate([
    {
        $lookup: {
            from: "instrumenttypes",
            localField: "instrumentTypeId",    // field in the orders collection
            foreignField: "_id",  // field in the items collection
            as: "instruments"
        }
    }
    ,
    {
        $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$instruments", 0] }, "$$ROOT"] } }
    },
    { $project: { instruments: 0, type: '$instruments[0].name' } } // suppress the instruments elemnt
]
);


