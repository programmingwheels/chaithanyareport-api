const User = require("../models/user");
const Payment = require("../models/payments")
const mongoose = require("mongoose");

const monthArr = ['jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sep', 'oct', 'nov', 'dec'];
const CalculateTotalLevy = (year, userId) => {
    console.log(new Date(year, 7, 1));
    console.log(userId);
    return Payment.find({
        "feeType": 1, approveStatus: 1, userId: new mongoose.Types.ObjectId(userId), createdAt: {
            $gte: new Date(year - 1, 1, 1),
            $lt: new Date(year, 12, 31)
        }
    })
        .then(payments => {
            let sum = 0;
            payments.forEach(item => {
                sum += item.amount
            })
            return sum;
        })
}

const CalculateTotalArrearPaid = (year, userId) => {
    console.log(new Date(year, 7, 1));
    console.log(userId);
    return Payment.find({
        "feeType": 2, approveStatus: 1, userId: new mongoose.Types.ObjectId(userId), createdAt: {
            $gte: new Date(year - 1, 1, 1),
            $lt: new Date(year, 12, 31)
        }
    })
        .then(payments => {
            let sum = 0;
            payments.forEach(item => {
                sum += item.amount
            })
            return sum;
        })
}
const getConsolidatedReport = async (req, res) => {
    const users = await User.find({});
    const finalObj = []
    for (let user of users) {
        const obj = {};
        //need to replace with not hardcoded year
        let totalLevy = await CalculateTotalLevy(2022, user._id);
        let arrearPaid = await CalculateTotalArrearPaid(2022, user._id);
        obj.arrier = user.openingArrier - arrearPaid;
        obj.total = totalLevy;
        obj.name = user.name;
        let noOfMonths = Math.ceil(totalLevy / 300);
        for (let i = 0; i < noOfMonths; i++) {
            if (i == noOfMonths - 1) {
                let lev = totalLevy % 300 == 0 ? 300 : totalLevy % 300
                obj[monthArr[i]] = lev;

            } else {
                obj[monthArr[i]] = 300;
            }
        }
        finalObj.push(obj)

    }
    return res.json(finalObj);
}

module.exports = {
    getConsolidatedReport
}