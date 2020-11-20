import inquirer from 'inquirer';
import { Dict } from '@mohism/utils';

export interface ICustomerOption {
  value: string;
  label: string;
}

type Selection = Array<string> | Dict<string> | Array<ICustomerOption>;

export interface IQuestion {
  select(prompt: string, choices: Selection, defaultValue?: string): Promise<string>;
  input(prompt: string, defaultValue?: string): Promise<string>;
  checkbox(prompt: string, choices: Array<string>): Promise<Array<string>>;
  confirm(prompt: string, defaultValue?: boolean): Promise<boolean>;
}

class Question implements IQuestion {
  async select(prompt: string, choices: Selection, defaultValue?: string): Promise<string> {
    const formatChoices = [];
    if (Array.isArray(choices)) {
      choices.forEach((choise: String | ICustomerOption) => {
        if (typeof choise === 'string') {
          formatChoices.push({
            name: choise,
            value: choise,
          });
        } else {
          const { value, label: name } = choise as ICustomerOption;
          formatChoices.push({
            name,
            value,
          });
        }
      });
    } else {
      for (let k in choices) {
        formatChoices.push({
          name: choices[k],
          value: k,
        });
      }
    }

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'sl',
        choices: formatChoices,
        message: prompt,
        default: defaultValue,
      }
    ]);
    return answer.sl;
  }

  async input(prompt: string, defaultValue?: string): Promise<string> {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: prompt,
        default: defaultValue,
      }
    ]);
    return answer.input;
  }

  async checkbox(prompt: string, choices: Array<string>): Promise<Array<string>> {
    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'checkbox',
        message: prompt,
        choices: choices.map(item => { return { name: item }; }),
      }
    ]);
    return answer.checkbox;
  }

  async confirm(prompt: string, defaultValue: boolean = false): Promise<boolean> {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: prompt,
        default: !!defaultValue,
      }
    ]);
    return answer.confirm;
  }
}

export default new Question();