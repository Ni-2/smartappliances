import fs  from 'fs';
import path from 'path';

export default (id) => {
    const allSerialsFileName = path.resolve(__dirname, '../app-data/all-serials.json');
    const allSerialsJson = fs.readFileSync(allSerialsFileName, 'utf-8');
    const allSerials = JSON.parse(allSerialsJson);

    setTimeout(() => {
        allSerials[id].status = 'Done!';
        fs.writeFileSync(allSerialsFileName, JSON.stringify(allSerials, null, 4), 'utf-8');
    }, 15000);

    setTimeout(() => {
        allSerials[id].status = 'available';
        fs.writeFileSync(allSerialsFileName, JSON.stringify(allSerials, null, 4), 'utf-8');
    }, 30000);

    allSerials[id].status = 'in operation';
    fs.writeFileSync(allSerialsFileName, JSON.stringify(allSerials, null, 4), 'utf-8');

    return true;
};
