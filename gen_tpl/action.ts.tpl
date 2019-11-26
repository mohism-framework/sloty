import ActionBase from '@mohism/cli-wrapper/dist/libs/action.class';
import { ArgvOption } from '@mohism/cli-wrapper/dist/libs/utils/type';
import { Dict } from '@mohism/utils';

class _FOO_Action extends ActionBase {
  options(): Dict<ArgvOption> {
    return {};
  }

  description(): string {
    return `I am FOO`;
  }

  async run(options?: Dict<any>): Promise<any> {
    // start here
  }
}

export default new _FOO_Action();