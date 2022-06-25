const fs = require('fs');
const configuration = require("../../config.json");


function getCacheService() {
    return Cache.getInstance();
}

class Cache {

    static #instance;

    filePath = __dirname + '/cache.json';


    static getInstance() {
        if (!Cache.#instance) {
            Cache.#instance = new Cache()
        }
        return Cache.#instance
    }
  


    save(key, objToSave, validTimeMinutes) {
        let newObjectToSave = {
            "date": Date.now(),
            "validMiliseconds": validTimeMinutes * 60 * 1000,
            "data": objToSave
        }

        let currentContent = {};
        if (fs.existsSync(this.filePath)) {
            currentContent =  JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        }

        currentContent[key] = newObjectToSave;        
        

         
        
        let data = JSON.stringify(currentContent);
        fs.writeFileSync(this.filePath, data,(err) => {
            if (err) {
                throw err;
            }
            console.log("JSON data is saved.");
        });  
        
    }

    load(key) {
        if (fs.existsSync(this.filePath)) {
            const file =  JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
            if(file[key] && Date.now() > (file[key].date + file[key].validMiliseconds)) {            
                return false;
            }

            if(file[key]) {
                return file[key].data;

            }
        }
        return false;    
       
    }    

}

module.exports = getCacheService;
 