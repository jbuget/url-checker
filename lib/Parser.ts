import {createReadStream} from 'fs';
import readline from 'readline';
import Line from './Line.js';

export default class Parser {

  delimiter: string;

  constructor(delimiter: string = ';') {
    this.delimiter = delimiter;
  }

  parse(file: string): Promise<Line[]> {
    return new Promise<Line[]>((resolve, reject) => {
      console.log('--------------------------------------------------------------------------------');
      console.log('Phase: "Parsing"');
      console.log(` - file: ${file}`);
      console.log(` - delimiter: ${this.delimiter}`);
      console.log();

      const hrStart: [number, number] = process.hrtime();

      let index: number = 1;
      const lines: Line[] = [];

      const rl = readline.createInterface({
        input: createReadStream(file),
      });

      rl.on('line', (rawLine) => {
        console.log(`  ${rawLine} ✓`);
        let reference: string, url: string;
        [reference, url] = rawLine.split(this.delimiter);
        const line = new Line(index++, rawLine, reference, url);
        lines.push(line);
      });

      rl.on('close', () => {
        console.log();
        const hrEnd: [number, number] = process.hrtime(hrStart);
        console.log('Execution time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000);
        console.log();

        resolve(lines);
      })
    })
  }
}
