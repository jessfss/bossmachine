
const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue } = req.body;
    const totalValue = Number(numWeeks) * Number(weeklyRevenue);
    if (totalValue >= 1000000) {
        next();
    } else {
        res.status(400).send("Idea should be greater than 1 Million USD");
    }
};

// Leave this exports assignment so that the function can be used elsewhere

module.exports = checkMillionDollarIdea;
