const { ActionBase } = require('@mohism/sloty');

class HelloAction extends ActionBase {
  options() {
    return {
      word: {
        desc: 'words-to-say',
        default: 'world',
      },
      c: {
        desc: 'color',
        default: 'red',
      }
    };
  }

  description() {
    return 'helping a hello in js';
  }

  async run(argv) {
    // 输出INFO
    this.info('this is INFO');
    // 输出WARN
    this.warn('this is WARN');
    // 输出ERR
    this.err('this is ERR');

    // 输出命令行参数
    this.info(argv);

    // 真正的逻辑
    const { word, c } = argv;
    console.log(`Hello ${word[c]}`);
  }
}

module.exports = new HelloAction();
