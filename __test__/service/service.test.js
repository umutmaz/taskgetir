const request  = require("supertest")
const server = require("../../server")
const service = require("../../service")
const db = require("../../db")
describe("Service", ()=>{
    describe("bodyValidation", ()=>{
        it("sends code 1 if missing body", async(done)=>{
            request(server).post("/records").expect(400).send({}).end((err,res)=>{
                expect(err).toBeFalsy();
                expect(res.body.code).toBe(1);
                expect(res.body.msg).toBe("missing body fields")
                done();
            })
        })
        it("sends code 1 if invalid dates", async(done)=>{
            request(server).post("/records").expect(400).send({
                startDate: "12-12-1992",
                endDate: "11-11-1999",
                minCount:1,
                maxCount:2
            }).end((err,res)=>{
                expect(err).toBeFalsy();
                expect(res.body.code).toBe(1);
                expect(res.body.msg).toBe("invalid date")
                done();
            })
        })
        it("sends code 1 if start date is greater than end date", async(done)=>{
            request(server).post("/records").expect(400).send({
                startDate: "1999-11-11",
                endDate: "1992-11-11",
                minCount:1,
                maxCount:2
            }).end((err,res)=>{
                expect(err).toBeFalsy();
                expect(res.body.code).toBe(1);
                expect(res.body.msg).toBe("start date is greater than end date")
                done();
            })
        })
        it("sends code 1 if one of the count fields is not int parseable", async(done)=>{
            request(server).post("/records").expect(400).send({
                startDate: "1990-11-11",
                endDate: "1999-11-11",
                minCount:"a",
                maxCount:2
            }).end((err,res)=>{
                expect(err).toBeFalsy();
                expect(res.body.code).toBe(1);
                expect(res.body.msg).toBe("count fields has to be integer")
                done();
            })
        })
        it("sends code 1 if maxCount is less than minCount", async(done)=>{
            request(server).post("/records").expect(400).send({
                startDate: "1990-11-11",
                endDate: "1999-11-11",
                minCount:3,
                maxCount:2
            }).end((err,res)=>{
                expect(err).toBeFalsy();
                expect(res.body.code).toBe(1);
                expect(res.body.msg).toBe("maxCount is less than minCount")
                done();
            })
        })
        it("sends code 0 if everything is ok", async(done)=>{
            await db.connect();
            request(server).post("/records").expect(200).send({
                startDate: "1990-11-11",
                endDate: "1999-11-11",
                minCount:1,
                maxCount:2
            }).end((err,res)=>{
                expect(err).toBeFalsy();
                expect(res.body.code).toBe(0);
                expect(res.body.msg).toBe("Success")
                done();
            })
        }) 
    })
    
})
