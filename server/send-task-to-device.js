import fs from 'fs';
import path from 'path';

const changeTask = (id, task, allSerialsFileName) => {
  const allSerialsJson = fs.readFileSync(allSerialsFileName, 'utf-8');
  const allSerials = JSON.parse(allSerialsJson);
  allSerials[id].status = task;
  fs.writeFileSync(allSerialsFileName, JSON.stringify(allSerials, null, 2), 'utf-8');
};

export default (
  id,
  usersTask,
  allSerialsFileName = path.resolve(__dirname, '../app-data/all-serials.json'),
) => {
  setTimeout((task) => changeTask(id, task, allSerialsFileName), 10000, 'Done!');
  setTimeout((task) => changeTask(id, task, allSerialsFileName), 20000, 'available');
  changeTask(id, 'in operation', allSerialsFileName);
  return true;
};
