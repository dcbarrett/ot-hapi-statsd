const expect = require('expect.js');
const plugin = require('../index.js');

describe('plugin attributes', function() {
  it('should contain name', function() {
    expect(plugin.register.attributes.name).to.equal('ot-hapi-statsd');
  });

  it('should contain version', function() {
    expect(plugin.register.attributes.version).to.be.ok;
  });
});
