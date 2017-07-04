const PythonShell = require('python-shell');
const EventEmitter = require('events');
const util = require('util');

function PN532(config) {
  const self = this;

  const options = Object.assign(
    {
      CS: 16,
      MOSI: 20,
      MISO: 19,
      SCLK: 21,
      SCAN_TIMEOUT: 1.5
    },
    config
  );

  this.pyshell = new PythonShell(__dirname + '/lib/pn532.py', {
    args: [options.SCAN_TIMEOUT, options.CS, options.MOSI, options.MISO, options.SCLK]
  });

  // TODO: begin according to config provided
  this.pyshell.on('message', function(message) {
    const payload = JSON.parse(message);
    switch (payload.code) {
      case 1:
        self.emit('initialized', payload.data);
        break;
      case 3:
        self.emit('firmware_version', payload.data);
        break;
      case 4:
        self.emit('card_found', payload.data);
        break;
      default:
        console.error('no code found');
    }
  });

  this.pyshell.on('error', function(err) {
    console.error('err: ' + err);
  });

  this.pyshell.on('close', function(close) {
    console.log('Connection to script closed : ' + close);
  });
}
util.inherits(PN532, EventEmitter);

module.exports = PN532;
