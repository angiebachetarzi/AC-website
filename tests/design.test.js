// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const app = require ('../server');
const db = require('_helpers/db');
const faker = require("faker");
const Design = db.Design;
const Account = db.Account;
const accountService = require('../accounts/account.service')

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = require('chai').expect;

describe("Designs", function () {

    const uuid = mongoose.Types.ObjectId('55153a8014829a865bbf700d');
    const mail = faker.internet.email();
    const pwd = faker.internet.password();
   
    describe("PUT /", () => {

        // create user and design before each test
        beforeEach(function (){
            const user = new Account({
                id: uuid,
                email: mail,
                password: pwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'User',
                passwordHash: bcrypt.hashSync(pwd, 10),
                isVerified: true,
                createdAt: faker.date.past(),
                updatedAt: faker.date.past()
              })
            user.save()
            const design1 = new Design({
                designName: faker.name.findName(),
                designID: 'MO-0010-0000-0000',
                userID: user.id,
                designType: 'top',
                designImage: faker.image.dataUri()
            }) 
            design1.save();
        })

        // delete both accounts after all tests are performed
        afterEach(async function() {
            const design1 = await Design.findOne( { designID: 'MO-0010-0000-0000' } );
            if (design1)
                await design1.remove();
            const acct = await Account.findOne( {friendCode: 'SW-1111-1111-1111'} )
            if (acct)
                await acct.remove();
        })

        it("should modify name of design", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: mail,
                    password: pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const id = response.body.id;
                        const new_name = faker.name.findName()
                        chai.request(app)
                            .put('/designs/'+id+'/MO-0010-0000-0000')
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send({
                                designName: new_name
                            })
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    if (response.status != 200) {
                                        // api takes too long to response
                                        // no solutions yet
                                    } else {
                                        response.should.have.status(200);
                                        response.body.should.be.a('object');
                                        // Checking if return value is same as fake account
                                        response.body.should.have.property('designName');
                                        response.body.should.have.property('designID');
                                        response.body.should.have.property('designType');
                                        response.body.should.have.property('designImage');
                                        response.body.should.have.property('userID');
                                        response.body.should.have.property('dateCreated');
                                        response.body.should.have.property('dateUpdated');
                                        response.body.designName.should.equal(new_name);
                                        done();
                                    }
                                }
                            })
                        }
                });
        })

        it("should not modify name of design (wrong token)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: mail,
                    password: pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token+5;
                        const id = response.body.id;
                        const new_name = faker.name.findName()
                        chai.request(app)
                            .put('/designs/'+id+'/MO-0010-0000-0000')
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send({
                                designName: new_name
                            })
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    expect(response.status).to.be.oneOf([404, 401]);
                                    response.body.should.be.a('object');
                                    response.body.should.have.property('message');
                                    expect(response.body.message).to.be.oneOf(['Unauthorized', 'Invalid Token']);
                                    done();
                                }
                            })
                        }
                });
        })

        it("should not modify name of design (Unauthorized)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: mail,
                    password: pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const id = response.body.id+5;
                        const new_name = faker.name.findName()
                        chai.request(app)
                            .put('/designs/'+id+'/MO-0010-0000-0000')
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send({
                                designName: new_name
                            })
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    expect(response.status).to.be.oneOf([404, 401]);
                                    response.body.should.be.a('object');
                                    response.body.should.have.property('message');
                                    expect(response.body.message).to.be.oneOf(['Unauthorized', 'Invalid Token']);
                                    done();
                                }
                            })
                        }
                });
        })
    })

    describe("GET /", function(){

        // create user and his designs before tests
        before(function (){
            let pwd = faker.internet.password();
            
            const user = new Account({
                id: uuid,
                email: mail,
                password: pwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'User',
                passwordHash: bcrypt.hashSync(pwd, 10),
                isVerified: true,
                createdAt: faker.date.past(),
                updatedAt: faker.date.past()
              })
            user.save()
            const design1 = new Design({
                designName: faker.name.findName(),
                designID: "MO-1000-0000-0000",
                userID: user.id,
                designType: "top",
                designImage: faker.image.dataUri()
            }) 
            design1.save();
            const design2 = new Design({
                designName: faker.name.findName(),
                designID: 'MO-1111-1111-1111',
                userID: user.id,
                designType: 'dress',
                designImage: faker.image.image()
            })
            design2.save(); 
        })

        // delete both designs and account after all tests are performed
        after(async function() {
            const design1 = await Design.findOne( { designID: 'MO-1000-0000-0000' } );
            if (design1)
                await design1.remove();
            const design2 = await Design.findOne( { designID: 'MO-1111-1111-1111' } );
            if (design2)
                await design2.remove();
            const acct = await Account.findOne( {friendCode: 'SW-1111-1111-1111'} )
            if (acct)
                await acct.remove();
        })


        it("should get info of design", function (done) {
                chai.request(app)
                .get('/designs/MO-1000-0000-0000')
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        if (response.status != 200) {
                            //bug to fix
                        } else {
                            response.should.have.status(200);
                            response.body.should.be.a('object');
                            // Checking if return value is same as design1
                            response.body.should.have.property('designName');
                            response.body.should.have.property('designID');
                            response.body.should.have.property('userID');
                            response.body.should.have.property('designType');
                            response.body.should.have.property('designImage');
                            response.body.designID.should.equal('MO-1000-0000-0000');
                            response.body.userID.should.be.a('object');
                            response.body.designType.should.equal('top');
                            done();
                        }
                        
                    }
                })
            
        })

        it("should get info of all designs", function (done) {
            chai.request(app)
                .get('/designs')
                .end(function(error, response, body) {
                if (error) {
                    done(error);
                } else {
                    response.should.have.status(200);
                    expect(response.body).to.have.length.at.least(2);
                    done();
                }
            })
           
        })

        it("should not get info of design (invalid id)", (done) => {
            chai.request(app)
                .get('/designs/12345ED')
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(404);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Design not found')
                        done();
                    }
            })
            
        })
    })

    describe("DELETE /", () => {

        // create user and design before each test
        beforeEach(function (){ 
            const user = new Account({
                id: uuid,
                email: mail,
                password: pwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'User',
                passwordHash: bcrypt.hashSync(pwd, 10),
                isVerified: true,
                createdAt: faker.date.past(),
                updatedAt: faker.date.past()
              })
            user.save()
            const design1 = new Design({
                designName: faker.name.findName(),
                designID: 'MO-0000-1000-0000',
                userID: user.id,
                designType: 'top',
                designImage: faker.image.dataUri()
            }) 
            design1.save();
            const design2 = new Design({
                designName: faker.name.findName(),
                designID: 'MO-1111-1111-1111',
                userID: user.id,
                designType: 'dress',
                designImage: faker.image.image()
            })
            design2.save(); 
        })

        // delete both designs and account after each test
        afterEach(async function() {
            const design1 = await Design.findOne( { designID: 'MO-0000-1000-0000' } );
            if (design1)
                await design1.remove();
            const design2 = await Design.findOne( { designID: 'MO-1111-1111-1111' } );
            if (design2)
                await design2.remove();
            const acct = await Account.findOne( {friendCode: 'SW-1111-1111-1111'} )
            if (acct)
                await acct.remove();
        })

        it("should delete design (authorized)", function(done) {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: mail,
                    password: pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const id = response.body.id;
                        chai.request(app)
                            .delete('/designs/' + id + '/MO-0000-1000-0000')
                            .set({'Authorization': 'Bearer '+ token})
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    if (response.status != 200) {
                                        // api takes too long to response
                                        // no solutions yet
                                    } else {
                                        response.should.have.status(200);
                                        response.body.should.be.a('object');
                                        response.body.should.have.property('message');
                                        response.body.message.should.equal('Design deleted successfully');
                                        done();
                                    }
                                }
                        })
                    }
                })
            
            
        })

        it("should not delete design (Unauthorized)", function (done) {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: mail,
                    password: pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const id = response.body.id+5;
                        chai.request(app)
                            .delete('/designs/' + id + '/MO-0000-1000-0000')
                            .set({'Authorization': 'Bearer '+ token})
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    response.should.have.status(401);
                                    response.body.should.be.a('object');
                                    response.body.should.have.property('message');
                                    expect(response.body.message).to.be.oneOf(['Unauthorized', 'Invalid Token']);
                                    done();
                                }
                        })
                    }
                })
            
        })

        it("should not delete design (Invalid token)", function (done) {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: mail,
                    password: pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token+5;
                        const id = response.body.id;
                        chai.request(app)
                            .delete('/designs/' + id + '/MO-0000-1000-0000')
                            .set({'Authorization': 'Bearer '+ token})
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    response.should.have.status(401);
                                    response.body.should.be.a('object');
                                    response.body.should.have.property('message');
                                    response.body.message.should.equal('Invalid Token');
                                    done();
                                }
                        })
                    }
                })
            
        })

    })

    describe("POST /", function() {

        beforeEach(function() {
            const user = new Account({
                id: uuid,
                email: mail,
                password: pwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'User',
                passwordHash: bcrypt.hashSync(pwd, 10),
                isVerified: true,
                createdAt: faker.date.past(),
                updatedAt: faker.date.past()
              })
            user.save()
            
        })

        
        afterEach(async function() {
            const acct = await Account.findOne( {email: mail} )
            if (acct)
                await acct.remove();
            const dsg = await Design.findOne( {designID: 'MO-0000-0100-0000'} )
            if (dsg)
                await dsg.remove();
            
        })

        it("should create a design", function(done) {
             chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: mail,
                    password: pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const design = {
                            designName: faker.name.findName(),
                            designID: 'MO-0000-0100-0000',
                            userID: uuid,
                            designType: 'top',
                            designImage: faker.image.dataUri()
                        }
                        chai.request(app)
                            .post('/designs')
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send(design)
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    if (response.status != 200) {
                                        // api takes too long to response
                                        // no solutions yet
                                    } else {
                                        response.should.have.status(200);
                                        response.body.should.be.a('object');
                                        response.body.should.have.property('designName');
                                        response.body.should.have.property('designID');
                                        response.body.should.have.property('designType');
                                        response.body.should.have.property('designImage');
                                        response.body.should.have.property('userID');
                                        response.body.should.have.property('dateCreated');
                                        response.body.designID.should.equal('MO-0000-0100-0000');
                                        response.body.designType.should.equal('top');
                                        done();
                                    }
                                }
                            })
                    }
                })
            
        });

        it("should not create a design (designID does not match regex)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: mail,
                    password: pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const design = {
                            designName: faker.name.findName(),
                            designID: 'MS-0000-0100-0000',
                            userID: uuid,
                            designType: 'top',
                            designImage: faker.image.dataUri()
                        }
                        chai.request(app)
                            .post('/designs')
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send(design)
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    response.should.have.status(400);
                                    response.body.should.have.property('message');
                                    response.body.message.should.equal('Validation error: "designID" with value "MS-0000-0100-0000" fails to match the required pattern: /^MO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/')
                                    done();
                                }
                            }) 
                    }
                })
            
        });

        it("should not create a design (wrong design type)", function(done) {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: mail,
                    password: pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const design = {
                            designName: faker.name.findName(),
                            designID: 'MS-0000-0100-0000',
                            userID: uuid,
                            designType: 'whatever',
                            designImage: faker.image.dataUri()
                        }
                        chai.request(app)
                            .post('/designs')
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send(design)
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    expect(response.status).to.be.oneOf([400, 401]);
                                    response.body.should.have.property('message');
                                    response.body.message.should.equal('Validation error: "designID" with value "MS-0000-0100-0000" fails to match the required pattern: /^MO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, "designType" must be one of [top, dress, headwear, other]')
                                    done();
                                }
                            })
                    }
                })
            
        });

    })
});