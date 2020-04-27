// TODO: transform this in a function
import fs from 'fs';
import path from 'path';

const places = fs.readdirSync(path.dirname(__filename));
const { name: here } = path.parse(path.basename(__filename));
const models = [];
for (const place of places) {
  const { name } = path.parse(place);
  if (name !== here) {
    models.push(require(`./${name}`).default);
  }
}

export default models;
