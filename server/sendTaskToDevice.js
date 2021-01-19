import fs  from 'fs';
import path from 'path';

export default (id) => {
  const allSerialsFileName = path.resolve(__dirname, '../app-data/all-serials.json');
  const changeTask = (task) => {
    const allSerialsJson = fs.readFileSync(allSerialsFileName, 'utf-8');
    const allSerials = JSON.parse(allSerialsJson);
    allSerials[id].status = task;
    fs.writeFileSync(allSerialsFileName, JSON.stringify(allSerials, null, 4), 'utf-8');
  };

  setTimeout((task) => changeTask(task), 15000, 'Done!');
  setTimeout((task) => changeTask(task), 30000, 'available');
  changeTask('in operation');
  return true;
};
