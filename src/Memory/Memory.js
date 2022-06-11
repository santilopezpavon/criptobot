const fs = require('fs');
const configuration = require("../../config.json");


function getFilesService() {
    return Memory.getInstance();
}

class Memory {

    static #instance;

    filePath = __dirname + '/data.json';


    static getInstance() {
        if (!Memory.#instance) {
            Memory.#instance = new Memory()
        }
        return Memory.#instance
    }

   

    saveFile(objToSave) {
        let data = JSON.stringify(objToSave);
        fs.writeFileSync(this.filePath, data,(err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });        
    }

    loadFile() {
       return  JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    }    

}

module.exports = getFilesService;
 