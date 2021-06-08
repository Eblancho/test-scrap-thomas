class Deces {
    constructor(browser) {
        this.browser = browser;
        //connecter la bdd
    }

    async init() {
        const page = await this.browser.browser.newPage();
        await page.goto("https://www.libramemoria.com/avis");
        this.primary = page;
    }

    async getDeaths(year, month, day) {
        let isOk = true;
        const baseUrl = "https://www.libramemoria.com/avis/" + year + "/" + month + "/" + day;
        await this.primary.goto(baseUrl);
        

        const deathsOfTheDay = [];

        // On commence par la première page, déjà chargé puis on ne s'arrete pas tant qu'il n'y a une/cinq page suivante
        let page = 1;

        while(isOk) {
            // création d'un worker pour verifier que le décès est bien sur le bon jour
            // seul moyen de sortir de la boucle c'est que result.reason === false

            const results = await Promise.allSettled([
                this.getDeathsList(baseUrl, page),
                this.getDeathsList(baseUrl, page+1),
                this.getDeathsList(baseUrl, page+2),
                this.getDeathsList(baseUrl, page+3),
                this.getDeathsList(baseUrl, page+4)
            ]);

            // Chaque worker va soit retourner l'objet deces dans le cas ou c'est le bon jour, soit false
            results.forEach(result => {                
                if (result.reason === false) { isOk = false; }
                else {
                    // result.value doit être sous la forme :
                    /**
                     * {
                            title: String,
                            age: String,
                            city: String,
                            url: String
                     * }
                     */
                    deathsOfTheDay.push(result.value);
                }
            });

            page = page + 5;
        }

        const result = [];

        deathsOfTheDay.forEach(elements => {
            elements.forEach(element => {
                result.push(element); 
            });   
        });

        return result;
    }
    /*Pour acceder a la variable "browser" qui est ton puppeteer, tu dois faire this.browser.browser
            Par exemple : const page = await this.browser.browser.newPage(); crée un nouvel objet page */

    async getDeathsList(baseUrl, pageNumber) {
        return new Promise(async (resolve, reject) => {
            try { 
                const page = await this.browser.browser.newPage();
                await page.goto(baseUrl+"?page="+pageNumber);
                
                
                const result = await page.evaluate(() => {
                    let deces = [];
                    const elements= document.querySelectorAll(".ligne:not(.entete)");
                    for (element of elements) {
                        deces.push({
                            title: element.querySelector('div.cellule.nom a').innerText.trim().replace(/\n/g,' '),
                            age: element.querySelector('div.cellule.age.hideXs_tablecell').innerText,
                            city: element.querySelector('div.cellule.ville.liste_virgule > span > a').innerText,
                            url: element.querySelector('div.cellule.nom a').href 
                        })
                        
                    }
                    return deces;
                })
                    
                await page.close();
                
                if(result && result.length > 0) {
                    resolve(result);
                } else {
                    reject(false);
                }
                //resolve(); retour de page.evaluate 
                // TU ES DANS UNE PROMISE, RETURN NE FONCTIONNE PAS, TU DOIS FAIRE resolve(CE QUE TU VEUX RETURN)
            } catch (error) {
                reject(false)
            }
        })
    }
    async saveIntoDB(deces) {
        //connexion a la bd
        const db = require("../../app/models");
        const User = db.user;

        for (let index = 0; index < deces.length; index++) {
            const d = deces[index];

            //envoyer a la bdd
            const createResults = await User.findOrCreate({ // oui
                where: { 
                title: d.title,
                age: d.age,
                city: d.city,
                url: d.url }
            })            
        }
    }

}

module.exports = Deces;