// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const app = require ('../server');
const db = require('_helpers/db')
const Account = db.Account;

// Configure chai
chai.use(chaiHttp);
chai.should();
const expect = require('chai').expect;

describe("Acounts", () => {
   
    describe("POST /", () => {

        afterEach(async () => {
            const account = await Account.findOne( { 'email': 'fake@fake.com' } );
            if (account)
                await account.remove();
            const account1 = await Account.findOne( { 'email': 'test@test.com' } );
            if (account1)
                await account1.remove();
        })

        it("should create an account", (done) => {
            const newAccount = {
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111"
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

        it("should not create an account (password != confirmPassword)", (done) => {
            const newAccount = {
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefakee",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111"
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

        it("should not create an account (email is not email)", (done) => {
            const newAccount = {
                "email": "fakefake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111"
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

        it("should not create an account (length of password < 6)", (done) => {
            const newAccount = {
                "email": "fake@fake.com",
                "password": "fake",
                "confirmPassword": "fake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111"
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

        it("should not create an account (creatorID does not match regex)", (done) => {
            const newAccount = {
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "M0-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111"
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

        it("should not create an account (friendCode does not match regex)", (done) => {
            const newAccount = {
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "Sk-1111-1111-1111"
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
        
        it("should authenticate (correct email/password)", (done) => {
            const fakeAccount = new Account({
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111",
                "role": "User",
                "passwordHash": bcrypt.hashSync("fakefake", 10),
                "isVerified": true
            })
            fakeAccount.save();
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "fake@fake.com",
                    "password": "fakefake"
                })
                .end(function(error, response, body) {
                    if (error) {
                        done(error);
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
                        response.body.email.should.equal('fake@fake.com');
                        response.body.creatorID.should.equal('MA-1111-1111-1111');
                        response.body.friendCode.should.equal('SW-1111-1111-1111');
                        response.body.role.should.equal('User');
                        done();
                    }
                })
            
        });

        it("should not authenticate (incorrect password)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "fake@fake.com",
                    "password": "test1"
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

        it("should not authenticate (incorrect email)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "test@fake.com",
                    "password": "fakefake"
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

        it("should not verify email (empty token)", (done) => {
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

        it("should not verify email (no user authenticated)", (done) => {
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

        it("should not work (forgot password with empty email)", (done) => {
            chai.request(app)
                .post('/accounts/forgot-password')
                .set('content-type', 'application/json')
                .send({
                    "email": ""
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

        it("should work (forgot password with non existing email)", (done) => {
            chai.request(app)
                .post('/accounts/forgot-password')
                .set('content-type', 'application/json')
                .send({
                    "email": "bs@bs.fr"
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

        it("should work (forgot password with valid email)", (done) => {
            const fakeAccount = new Account({
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111",
                "role": "User",
                "passwordHash": bcrypt.hashSync("fakefake", 10),
                "isVerified": true
            })
            fakeAccount.save();
            chai.request(app)
                .post('/accounts/forgot-password')
                .set('content-type', 'application/json')
                .send({
                    "email": "fake@fake.com"
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

        it("should create new user as admin", (done) => {
            const newAccount = {
                "email": "test@test.com",
                "password": "testtest",
                "confirmPassword": "testtest",
                "creatorID": "MA-0000-0000-0000",
                "friendCode": "SW-0000-0000-0000",
                "role": "User"
            }
            const adminAccount = new Account({
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111",
                "role": "Admin",
                "passwordHash": bcrypt.hashSync("fakefake", 10),
                "isVerified": true
            })
            adminAccount.save();
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "fake@fake.com",
                    "password": "fakefake"
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
                            })
                        }
                });
        });

        it("should not create new user (role is not admin)", (done) => {
            const newAccount = {
                "email": "test@test.com",
                "password": "testtest",
                "confirmPassword": "testtest",
                "creatorID": "MA-0000-0000-0000",
                "friendCode": "SW-0000-0000-0000",
                "role": "User"
            }
            const adminAccount = new Account({
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111",
                "role": "User",
                "passwordHash": bcrypt.hashSync("fakefake", 10),
                "isVerified": true
            })
            adminAccount.save();
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "fake@fake.com",
                    "password": "fakefake"
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
                                    response.body.message.should.equal('Unauthorized')
                                    done();
                                }
                            })
                        }
                });
        });
    })

    describe("PUT /", () => {
        beforeEach(() => {
            const fakeAccount = new Account({
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111",
                "role": "User",
                "passwordHash": bcrypt.hashSync("fakefake", 10),
                "isVerified": true
            })
            fakeAccount.save();
        })

        afterEach(async () => {
            const account = await Account.findOne({ 'email': 'fake@fake.com' });
            if (account)
                account.remove()
        })

        it("should modify creatorID of account", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "fake@fake.com",
                    "password": "fakefake"
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
                                "creatorID": 'MA-1234-1234-1234'
                            })
                            .end(function(error, response, body) {
                                if (error) {
                                    done(error);
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
                                    response.body.email.should.equal('fake@fake.com');
                                    response.body.creatorID.should.equal('MA-1234-1234-1234');
                                    response.body.friendCode.should.equal('SW-1111-1111-1111');
                                    response.body.role.should.equal('User');
                                    done();
                                }
                            })
                        }
                });
        })

        it("should not modify creatorID of account (invalid token)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "fake@fake.com",
                    "password": "fakefake"
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
                                "creatorID": 'MA-1234-1234-1234'
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

    describe("GET /", () => {
        before(() => {
            const account1 = new Account({
                "email": "fake@fake.com",
                "password": "fakefake",
                "confirmPassword": "fakefake",
                "creatorID": "MA-1111-1111-1111",
                "friendCode": "SW-1111-1111-1111",
                "role": "Admin",
                "passwordHash": bcrypt.hashSync("fakefake", 10),
                "isVerified": true
            })
            account1.save();
            const account2 = new Account({
                "email": "test@test.com",
                "password": "testtest",
                "confirmPassword": "testtest",
                "creatorID": "MA-0000-0000-0000",
                "friendCode": "SW-0000-0000-0000",
                "role": "User",
                "passwordHash": bcrypt.hashSync("testtest", 10),
                "isVerified": true
            })
            account2.save();
        })

        it("should get info of user logged in", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "test@test.com",
                    "password": "testtest"
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
                            })
                        }
                });
        })

        it("should get info of all users (as admin)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "fake@fake.com",
                    "password": "fakefake"
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

        it("should not get info of all users (invalid token)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "fake@fake.com",
                    "password": "fakefake"
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

        it("should not get info of user logged in (Unauthorized)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "test@test.com",
                    "password": "testtest"
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

        it("should not get info of user logged in (invalid token)", (done) => {
            chai.request(app)
                .post('/accounts/authenticate')
                .set('content-type', 'application/json')
                .send({
                    "email": "test@test.com",
                    "password": "testtest"
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
});