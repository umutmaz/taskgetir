const server = require("../../server");
const request = require("supertest");
describe("Server", ()=>{
    it("returns pass message", async(done)=>{
        request(server).get("/test").end((err,res)=>{
            expect(err).toBeFalsy();
            expect(res.body.message).toBe("pass!");
            done();
        })
    })
})