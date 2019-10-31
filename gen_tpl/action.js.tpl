require('colors');
const ActionBase = require('@mohism/cli-wrapper/dist/libs/action.class').default;

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
