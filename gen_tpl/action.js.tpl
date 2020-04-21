require('colors');
const { ActionBase } = require('@mohism/sloty');

class _FOO_Action extends ActionBase {
  options() {
    return {};
  }

  description() {
    return 'I am FOO';
  }

  async run(argv) {
    // start here
  }
}

module.exports = new _FOO_Action();
