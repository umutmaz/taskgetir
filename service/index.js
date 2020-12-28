const validateDate = require("validate-date");
const db = require("../db/")
const {Router}=require("express");

const bodyValidator = (req,res,next)=>{
    const { startDate, endDate, minCount, maxCount } = req.body;
    if(!(startDate && endDate && minCount && maxCount)){
        res.status(400).send({
            code: 1,
            msg: `missing body fields`
        })
        return null;
    }
    const startValid = validateDate(startDate, "boolean", "yyyy-mm-dd")
    const endValid = validateDate(endDate, "boolean", "yyyy-mm-dd")
    if(!(startValid && endValid)){
        res.status(400).send({
            code: 1,
            msg: `invalid date`
        })
        return null;
    }
    if(new Date(startDate)>new Date(endDate)){
        res.status(400).send({
            code: 1,
            msg: `start date is greater than end date`
        })
        return null;
    }
    if(new Date(endDate)<new Date(startDate)){
        res.status(400).send({
            code: 1,
            msg: `end date is less than end date`
        })
        return null;
    }
    if(!(Number.isInteger(minCount) && Number.isInteger(maxCount))){
        res.status(400).send({
            code: 1,
            msg: `count fields has to be integer`
        })
        return null;

    }
    if(Number(maxCount)<Number(minCount)){
        res.status(400).send({
            code: 1,
            msg: `maxCount is less than minCount`
        })
        return null;

    }
    if(Number(minCount)>Number(maxCount)){
        res.status(400).send({
            code: 1,
            msg: `minCount is more than maxCount`
        })
        return null;
    }

    next();
}

const queryFilterBuilder = (req, res, next)=>{
    let { startDate, endDate, minCount, maxCount } = req.body;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    minCount = Number(minCount);
    maxCount = Number(maxCount);
    req.filter = {
        createdAt: {
            $gte:startDate,
            $lt:endDate
        },
        totalCount: {
            $gte:minCount,
            $lt:maxCount
        }
    }
    next();
}

const queryRecords=(req,res)=>{
    const filters = req.filter;
    db.query(filters).then((result)=>{
        res.status(200).send({
            code:0,
            msg:"Success",
            records: result
        })
    }).catch((err)=>{
        res.status(400).send({
            code:2,
            msg:err.message
        })
    })
}

const router = Router();

router.route("/").post(bodyValidator, queryFilterBuilder, queryRecords);

module.exports = router;