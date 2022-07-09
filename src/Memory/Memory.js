const fs = require('fs');
const configuration = require("../../config.json");


function getFilesService(nameFile = "data") {
    return new Memory(nameFile);
}

class Memory {

    

    constructor(nameFile) {
        this.filePath = __dirname + '/' + nameFile + '.json';
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
     if (fs.existsSync(this.filePath)) {
        return  JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    }
    return false;
    
       
    }
    
    
    loadFileCheckEmpty(str) {
        const file = this.loadFile();
        if(typeof file === 'object' && file.hasOwnProperty("symbol")) {
            return file;
        }
        return false;
    }

}

module.exports = getFilesService;
 