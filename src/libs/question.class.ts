import inquirer from 'inquirer';

export interface IQuestion {
  select(prompt: string, choices: Array<any>, defaultValue?: any): Promise<any>;
  input(prompt: string, defaultValue?: any): Promise<any>;
  checkbox(prompt: string, choices: Array<any>): Promise<any>;
  confirm(prompt: string, defaultValue?: boolean): Promise<boolean>;
}

class Question implements IQuestion {
  async select(prompt: string, choices: Array<any>, defaultValue?: any): Promise<any> {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'sl',
        choices: choices.map((v, i) => { return { name: v, value: i }; }),
        message: prompt,
        default: defaultValue,
      }
    ]);
    return answer.sl;
  }

  async input(prompt: string, defaultValue?: any): Promise<any> {
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

  async checkbox(prompt: string, choices: Array<any>): Promise<any> {
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