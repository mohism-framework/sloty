import { ActionBase, ArgvOption } from '@mohism/sloty';
import { Dict } from '@mohism/utils';

class HelloAction extends ActionBase {
  options(): Dict<ArgvOption> {
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

  description(): string {
    return 'helping a hello';
  }

  async run(argv: Dict<any>) {
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

export default new HelloAction();
