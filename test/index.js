var should = require('chai').should()
var expect = require('chai').expect;
const opportunity = require('../index.js');
  
const opportunityNo = 5767;
const opportunityNo404 = 0;
const opportunitySpecialist = 15779;

opportunity.getOpportunity()
.then((data) => console.log(data))
.catch((err) => console.log(err.response.status))

describe('#getOpportunity',function() {

	it('fetches opportunity ' + opportunityNo, function(done) {

        opportunity.getOpportunity(opportunityNo)
        .then(function (data) {
            console.log(data)
            data.should.have.property('id');
            done()
        })
        .catch((err) => done(err))

    });

    it('doesnt find the opportunity ' + opportunityNo404, function(done) {

        opportunity.getOpportunity(opportunityNo404)
        .then(function (data) {
            done(err)
        })
        .catch(function(err) {
            
            err.response.status.should.equal(404);
            done()
        })

    });

    it('opportunity type is digital specialists ', function(done) {


        opportunity.getOpportunity(opportunitySpecialist)
        .then(function (data) {
            console.log(data)
            data.type.should.equal("Digital specialists");
            done()
        })
        .catch((err) => done(err))

    });

    it('opportunity type is digital outcomes', function(done) {


        opportunity.getOpportunity(opportunityNo)
        .then(function (data) {
            console.log(data)
            data.type.should.equal("Digital outcomes");
            done()
        })
        .catch((err) => done(err))

    });
});