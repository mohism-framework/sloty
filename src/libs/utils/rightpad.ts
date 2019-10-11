const rightpad = (str: string, count: number, char: string = ' '): string => {
  if (str.length > count) {
    return str.substr(0, count);
  }
  return `${str}${char.repeat(count - str.length)}`
}

export default rightpad;