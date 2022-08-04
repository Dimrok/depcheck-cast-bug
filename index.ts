import fg from 'fast-glob';

const b: any = 'foo';
const c = <string>b;

console.log(fg(c));
