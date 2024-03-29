'use strict';

// tests for smsReceived
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha-plugin');
const expect = mochaPlugin.chai.expect;
const sinon = require('sinon');
const helpers = require('../helpers');
let wrapped = mochaPlugin.getWrapper('smsReceived', '/handler.js', 'smsReceived');

describe('smsReceived', () => {
  beforeEach((done) => {
    this.event = {
      body: 'ToCountry=US&NumMedia=0&FromState=CA&SmsStatus=received&FromCity=&Body=%2B19207340123&FromCountry=US&To=%2B12063399008&ToZip=98154&NumSegments=1&From=%2B15025855961&ApiVersion=2010-04-01',
      headers: {
        Host: 'test.com',
      },
      requestContext: {
        path: '/test'
      }
    };
    this.createCallStub = sinon.stub();
    this.getTwilioClientStub = sinon.stub(helpers, 'getTwilioClient');
    this.getTwilioClientStub.returns({
      calls: {
        create: this.createCallStub.resolves({sid: 'sid'})
      }
    });

    done();
  });

  afterEach(() => {
    this.getTwilioClientStub.restore();
  });

  it('creates Twilio client', () => {
    return wrapped.run(this.event).then((response) => {
      expect(this.getTwilioClientStub.calledWith(
        process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN
      )).to.be.true;
    });
  });

  it('creates Call if valid user number', () => {
    return wrapped.run(this.event).then((response) => {
      expect(this.createCallStub.calledWith({
        url: 'https://test.com/test/+19207340123',
        to: '+15025855961',
        from: '+12037774647'
      })).to.be.true;
    });
  });

  it('does not create Call if invalid user number', () => {
    this.event.body = 'ToCountry=US&NumMedia=0&FromState=CA&SmsStatus=received&FromCity=&Body=%2B19207340123&FromCountry=US&To=%2B12063399008&ToZip=98154&NumSegments=1&From=%2B15025855965&ApiVersion=2010-04-01';
    return wrapped.run(this.event).then((response) => {
      expect(this.createCallStub.called).to.be.false;
    });
  });

  it('returns an empty XML response', () => {
    return wrapped.run(this.event).then((response) => {
      expect(response).to.deep.equal({
        statusCode: 200,
        headers: {
          'Content-Type': 'text/xml'
        }
      });
    });
  });
});
