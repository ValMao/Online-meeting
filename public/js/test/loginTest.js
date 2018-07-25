const assert = require('chai').assert;
const logoutAll = require('../logout').logoutAll;

describe('Log out', function(){
    it('user logged out', function(){
        let result = logoutAll();
        assert.equal(result,"");
    });
});