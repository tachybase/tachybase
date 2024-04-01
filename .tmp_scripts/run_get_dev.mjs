import { readFile, readdir, stat } from "fs/promises";
import { join } from "path";

const data = await readFile('./dev-error.log', "utf-8");

const lines = data.split('\n')

for (let line of lines) {
  if (line.startsWith('error')) {
    continue;
  }
  const result = line.match(/ '([^']*)' in/);
  const result2 = line.match(/packages\/plugins\/([^/]*\/[^/]*)\//)

  if (result && result2) {
    console.log(result[1], result2[1])
  }
  // console.log(line);
  // console.log(result2)
  // if (result) {
  //   console.log(result[1]);
  // } else {
  //   console.log(line);
  // }
}


