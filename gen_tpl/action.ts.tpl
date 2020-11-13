import { ActionBase, ArgvOption, IWithSubCommands } from '@mohism/sloty';
import { Dict } from '@mohism/utils';

class _FOO_Action extends ActionBase {
  options(): Dict<ArgvOption> {
    return {};
  }

  description(): string {
    return `I am FOO`;
  }

  async run(options: IWithSubCommands): Promise<any> {
    // start here
  }
}

export default new _FOO_Action();