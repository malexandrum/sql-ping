const assert = require('assert')
const { ping } = require('../index')


describe('ping', function() {
    it('passing empty option throws error', function() {
        assert.throws(ping);
    })
})