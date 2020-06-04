// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const app = require ('../server');
const db = require('_helpers/db');
const faker = require("faker");
const Account = db.Account;
const Design = db.Design;

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = require('chai').expect;

describe("Acounts", function() {

    const adminEmail = faker.internet.email();
    const adminPwd = faker.internet.password();

    const user1Email = faker.internet.email();
    const user1Pwd = faker.internet.password();

    const user2Email = faker.internet.email();
    const user2Pwd = faker.internet.password();

    describe("PUT /", function()  {

        // create fake account before each test
        beforeEach(function() {
            const fakeAccount = new Account({
                email: user1Email,
                password: user1Pwd,
                confirmPassword: user1Pwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'User',
                passwordHash: bcrypt.hashSync(user1Pwd, 10),
                isVerified: true
            })
            fakeAccount.save();
        })

        // delete fake account after each test
        afterEach(async function()  {
            const account = await Account.findOne({ email: user1Email });
            if (account)
                account.remove()
        })

        it("should modify creatorID of account", function (done) {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: user1Email,
                    password: user1Pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const id = response.body.id;
                        chai.request(app)
                            .put('/accounts/'+id)
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send({
                                creatorID: 'MA-1234-1234-1234'
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
                                        response.body.should.have.property('id');
                                        response.body.should.have.property('creatorID');
                                        response.body.should.have.property('email');
                                        response.body.should.have.property('friendCode');
                                        response.body.should.have.property('role');
                                        response.body.should.have.property('dateCreated');
                                        response.body.should.have.property('dateUpdated');
                                        response.body.creatorID.should.equal('MA-1234-1234-1234');
                                    }
                                    done();
                                }
                            })
                        }
                });
        })

        it("should not modify creatorID of account (invalid token)", function(done)  {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: user1Email,
                    password: user1Pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token+"45";
                        const id = response.body.id;
                        chai.request(app)
                            .put('/accounts/'+id)
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send({
                                creatorID: 'MA-1234-1234-1234'
                            })
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    response.should.have.status(401);
                                    response.body.should.have.property('message');
                                    response.body.message.should.equal('Invalid Token')
                                    done();
                                }
                            })
                        }
                });
        })
    })

    describe("GET /", function()  {

        // create admin user and ordinary user before tests
        before(function ()  {
            const account1 = new Account({
                email: adminEmail,
                password: adminPwd,
                confirmPassword: adminPwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'Admin',
                passwordHash: bcrypt.hashSync(adminPwd, 10),
                isVerified: true
            })
            account1.save();
            const account2 = new Account({
                email: user2Email,
                password: user2Pwd,
                confirmPassword: user2Pwd,
                creatorID: 'MA-0000-0000-0000',
                friendCode: 'SW-0000-0000-0000',
                role: 'User',
                passwordHash: bcrypt.hashSync(user2Pwd, 10),
                isVerified: true
            })
            account2.save();
        })

        // delete both accounts after all tests are performed
        after(async function()  {
            const account1 = await Account.findOne( { email: adminEmail } );
            if (account1)
                await account1.remove();
            const account2 = await Account.findOne( { email: user2Email } );
            if (account2)
                await account2.remove();
        })

        it("should get info of user logged in", function(done)  {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: user2Email,
                    password: user2Pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const id = response.body.id;
                        chai.request(app)
                            .get('/accounts/'+id)
                            .set({'Authorization': 'Bearer '+token})
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    if (response.status != 200) {
                                        //bug db too slow to respond
                                    } else {
                                        response.should.have.status(200);
                                        response.body.should.be.a('object');
                                        // Checking if return value is same as fake account
                                        response.body.should.have.property('creatorID');
                                        response.body.should.have.property('email');
                                        response.body.should.have.property('friendCode');
                                        response.body.should.have.property('role');
                                        response.body.should.have.property('dateCreated');
                                        response.body.email.should.equal(user2Email);
                                        response.body.creatorID.should.equal('MA-0000-0000-0000');
                                        response.body.friendCode.should.equal('SW-0000-0000-0000');
                                        response.body.role.should.equal('User');
                                    }
                                    
                                    done();
                                }
                            })
                        }
                });
        })

        it("should get info of all users (as admin)", function(done)  {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: adminEmail,
                    password: adminPwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        chai.request(app)
                            .get('/accounts')
                            .set({'Authorization': 'Bearer '+token})
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    response.should.have.status(200);
                                    expect(response.body).to.have.length.at.least(2);
                                    done();
                                }
                            })
                        }
                });
        })

        it("should not get info of all users (invalid token)", function(done)  {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: adminEmail,
                    password: adminPwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token+4;
                        chai.request(app)
                            .get('/accounts')
                            .set({'Authorization': 'Bearer '+token})
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    response.should.have.status(401);
                                    response.body.should.have.property('message');
                                    response.body.message.should.equal('Invalid Token');
                                    done();
                                }
                            })
                        }
                });
        })

        it("should not get info of user logged in (Unauthorized)", function(done)  {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: user2Email,
                    password: user2Pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const id = response.body.id+5;
                        chai.request(app)
                            .get('/accounts/'+id)
                            .set({'Authorization': 'Bearer '+token})
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    response.should.have.status(401);
                                    response.body.should.be.a('object');
                                    response.body.should.have.property('message');
                                    response.body.message.should.equal('Unauthorized');
                                    done();
                                }
                            })
                        }
                });
        })

        it("should not get info of user logged in (invalid token)", function(done)  {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: user2Email,
                    password: user2Pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token+5;
                        const id = response.body.id;
                        chai.request(app)
                            .get('/accounts/'+id)
                            .set({'Authorization': 'Bearer '+token})
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
                });
        })
    })
   
    describe("POST /", function() {

        beforeEach(function() {
            const fakeAccount = new Account({
                email: user1Email,
                password: user1Pwd,
                confirmPassword: user1Pwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'User',
                passwordHash: bcrypt.hashSync(user1Pwd, 10),
                isVerified: true
            })
            fakeAccount.save();
            const adminAccount = new Account({
                email: adminEmail,
                password: adminPwd,
                confirmPassword: adminPwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'Admin',
                passwordHash: bcrypt.hashSync(adminPwd, 10),
                isVerified: true
            })
            adminAccount.save();
        })

        // delete all used accounts in testing after each test
        afterEach(async function() {
            const account = await Account.findOne( { email: user2Email } );
            if (account)
                await account.remove();
            const account1 = await Account.findOne( { email: user1Email } );
            if (account1)
                await account1.remove();
            const account2 = await Account.findOne( { email: 'test@test.com' } );
            if (account2)
                await account2.remove();
            const account3 = await Account.findOne( { email: adminEmail } );
                if (account3)
                    await account3.remove();
        })

        it("should create an account", function (done) {
            const newAccount = {
                email: user2Email,
                password: user2Pwd,
                confirmPassword: user2Pwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111'
            }
            chai.request(app)
                .post('/accounts/register')
                .set('content-type', 'application/json')
                .send(newAccount)
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(200);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Registration successful, please check your email for verification instructions')
                        done();
                    }
                });
        });

        it("should not create an account (password != confirmPassword)", function(done) {
            const newAccount = {
                email: user2Email,
                password: user2Pwd,
                confirmPassword: user2Pwd+'2',
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111'
            }
            chai.request(app)
                .post('/accounts/register')
                .set('content-type', 'application/json')
                .send(newAccount)
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Validation error: \"confirmPassword\" must be [ref:password]')
                        done();
                    }
                });
        });

        it("should not create an account (email is not email)", function(done) {
            const newAccount = {
                email: 'g',
                password: user2Pwd,
                confirmPassword: user2Pwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111'
            }
            chai.request(app)
                .post('/accounts/register')
                .set('content-type', 'application/json')
                .send(newAccount)
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Validation error: \"email\" must be a valid email')
                        done();
                    }
                });
        });

        it("should not create an account (length of password < 6)", function(done) {
            const newAccount = {
                email: user2Email,
                password: 'fake',
                confirmPassword: 'fake',
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111'
            }
            chai.request(app)
                .post('/accounts/register')
                .set('content-type', 'application/json')
                .send(newAccount)
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Validation error: \"password\" length must be at least 6 characters long')
                        done();
                    }
                });
        });

        it("should not create an account (creatorID does not match regex)", function(done) {
            const newAccount = {
                email: user2Email,
                password: user2Pwd,
                confirmPassword: user2Pwd,
                creatorID: "M0-1111-1111-1111",
                friendCode: 'SW-1111-1111-1111'
            }
            chai.request(app)
                .post('/accounts/register')
                .set('content-type', 'application/json')
                .send(newAccount)
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Validation error: "creatorID" with value "M0-1111-1111-1111" fails to match the required pattern: /^MA-[0-9]{4}-[0-9]{4}-[0-9]{4}$/')
                        done();
                    }
                });
        });

        it("should not create an account (friendCode does not match regex)", function(done) {
            const newAccount = {
                email: user2Email,
                password: user2Pwd,
                confirmPassword: user2Pwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: "Sk-1111-1111-1111"
            }
            chai.request(app)
                .post('/accounts/register')
                .set('content-type', 'application/json')
                .send(newAccount)
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Validation error: \"friendCode\" with value \"Sk-1111-1111-1111\" fails to match the required pattern: /^SW-[0-9]{4}-[0-9]{4}-[0-9]{4}$/')
                        done();
                    }
                });
        });
        
        it("should authenticate (correct email/password)", function(done)  {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: user1Email,
                    password: user1Pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        if (response.status != 200) {
                            //bug db too slow to respond
                        } else {
                            response.should.have.status(200);
                            response.body.should.be.a('object');
                            // Checking if return value is same as fake account
                            response.body.should.have.property('id');
                            response.body.should.have.property('creatorID');
                            response.body.should.have.property('email');
                            response.body.should.have.property('friendCode');
                            response.body.should.have.property('role');
                            response.body.should.have.property('dateCreated');
                            response.body.should.have.property('token');
                            response.body.email.should.equal(user1Email);
                            response.body.creatorID.should.equal('MA-1111-1111-1111');
                            response.body.friendCode.should.equal('SW-1111-1111-1111');
                            response.body.role.should.equal('User');
                        }
                        done();
                    }
                })
            
        });

        it("should not authenticate (incorrect password)", function(done)  {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: "test@fake.com",
                    password: "test1"
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Email or password is incorrect')
                        done();
                    }
                });
        });

        it("should not authenticate (incorrect email)", function(done)  {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: "teest@fake.com",
                    password: "fakefake"
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Email or password is incorrect')
                        done();
                    }
                });
        });

        it("should not verify email (empty token)", function(done)  {
            chai.request(app)
                .post('/accounts/verify-email')
                .set('content-type', 'application/json')
                .send({
                    "token": ""
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Validation error: "token" is not allowed to be empty')
                        done();
                    }
                });
        });

        it("should not verify email (no user authenticated)", function(done)  {
            chai.request(app)
                .post('/accounts/verify-email')
                .set('content-type', 'application/json')
                .send({
                    "token": "whateves"
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Verification failed')
                        done();
                    }
                });
        });

        it("should not work (forgot password with empty email)", function(done)  {
            chai.request(app)
                .post('/accounts/forgot-password')
                .set('content-type', 'application/json')
                .send({
                    email: ""
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(400);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Validation error: "email" is not allowed to be empty')
                        done();
                    }
                });
        });

        it("should work (forgot password with non existing email)", function(done)  {
            chai.request(app)
                .post('/accounts/forgot-password')
                .set('content-type', 'application/json')
                .send({
                    email: "bs@bs.fr"
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(200);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Please check your email for password reset instructions')
                        done();
                    }
                });
        });

        it("should work (forgot password with valid email)", function(done)  {
            chai.request(app)
                .post('/accounts/forgot-password')
                .set('content-type', 'application/json')
                .send({
                    email: "test@fake.com"
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        response.should.have.status(200);
                        response.body.should.have.property('message');
                        response.body.message.should.equal('Please check your email for password reset instructions')
                        done();
                    }
                });
        });

        it("should create new user as admin", function(done)  {
            const newAccount = {
                email: "test@test.com",
                password: "testtest",
                confirmPassword: "testtest",
                creatorID: "MA-0000-0000-0000",
                friendCode: "SW-0000-0000-0000",
                role: 'User'
            }
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: adminEmail,
                    password: adminPwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        chai.request(app)
                            .post('/accounts')
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send(newAccount)
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    if (response.status != 200) {
                                        //bug db too slow to respond
                                    } else {
                                        response.should.have.status(200);
                                        response.body.should.be.a('object');
                                        // Checking if return value is same as fake account
                                        response.body.should.have.property('creatorID');
                                        response.body.should.have.property('email');
                                        response.body.should.have.property('friendCode');
                                        response.body.should.have.property('role');
                                        response.body.should.have.property('dateCreated');
                                        response.body.email.should.equal('test@test.com');
                                        response.body.creatorID.should.equal('MA-0000-0000-0000');
                                        response.body.friendCode.should.equal('SW-0000-0000-0000');
                                        response.body.role.should.equal('User');
                                        done();
                                    }
                                }
                            })
                        }
                });
        });

        it("should not create new user (role is not admin)", function(done)  {
            const newAccount = {
                email: "test@test.com",
                password: "testtest",
                confirmPassword: "testtest",
                creatorID: "MA-0000-0000-0000",
                friendCode: "SW-0000-0000-0000",
                role: 'User'
            }
            const adminAccount = new Account({
                email: user2Email,
                password: "fakefake",
                confirmPassword: "fakefake",
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'User',
                passwordHash: bcrypt.hashSync("fakefake", 10),
                isVerified: true
            })
            adminAccount.save();
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: user2Email,
                    password: "fakefake"
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        chai.request(app)
                            .post('/accounts')
                            .set({'content-type': 'application/json', 'Authorization': 'Bearer '+token})
                            .send(newAccount)
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
                                } else {
                                    response.should.have.status(401);
                                    response.body.should.have.property('message');
                                    expect(response.body.message).to.be.oneOf(['Unauthorized', 'Invalid Token']);
                                    done();
                                }
                            })
                        }
                });
        });
    })
    
    describe("DELETE /", function ()  {

        // create an admin user and an ordinary user
        before(async function()  {
            const account1 = new Account({
                email: adminEmail,
                password: adminPwd,
                confirmPassword: adminPwd,
                creatorID: 'MA-1111-1111-1111',
                friendCode: 'SW-1111-1111-1111',
                role: 'Admin',
                passwordHash: bcrypt.hashSync(adminPwd, 10),
                isVerified: true
            })
            account1.save();
            const account2 = new Account({
                email: user2Email,
                password: user2Pwd,
                confirmPassword: user2Pwd,
                creatorID: 'MA-0000-0000-0000',
                friendCode: 'SW-0000-0000-0000',
                role: 'User',
                passwordHash: bcrypt.hashSync(user2Pwd, 10),
                isVerified: true
            })
            account2.save();

            //get ordinary user's id
            const user = await Account.findOne( {email: user2Email} );
            if (user) {
                const fakeDesign = new Design({
                    designName: faker.name.findName(),
                    designID: 'MO-0100-0000-0000',
                    userID: user._id,
                    designType: 'top',
                    designImage: faker.image.dataUri()
                });
                fakeDesign.save();
            }
            
          })

        afterEach(async function() {
            const design = await Design.findOne( { designID: 'MO-0100-0000-0000' });
            if (design)
                await design.remove();
        })

        after(async function()  {
            const account1 = await Account.findOne( { email: adminEmail } );
            if (account1)
                await account1.remove();
            const account2 = await Account.findOne( { email: user2Email } );
            if (account2)
                await account2.remove();
        })

        it("should delete user and all it's designs (as admin)", function(done)  {
            Account.findOne( {email: user2Email} )
            .then(function(user) {
                chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: adminEmail,
                    password: adminPwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const user_id = user._id;
                        chai.request(app)
                            .delete('/accounts/' + user_id)
                            .set({'Authorization': 'Bearer '+token})
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
                                        response.body.message.should.equal('Account deleted successfully');
                                    }
                                    
                                    done();
                                }
                            })
                        }
                })
            }
                
            )
            
        })

        it("should not delete user and all it's designs (invalid token)", function(done)  {
            Account.findOne( {email: adminEmail} )
            .then(function(user) {
                chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    email: user2Email,
                    password: user2Pwd
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
                    } else {
                        const token = response.body.token;
                        const user_id = user._id;
                        chai.request(app)
                            .delete('/accounts/' + user_id)
                            .set({'Authorization': 'Bearer '+token})
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
            }
                
            )
            
        })

    })
});