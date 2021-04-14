const puppeteer = require('puppeteer');

class Browser {
    constructor() {
    
    }

    async init() {
        const launchOptions = { 
            headless: false, 
            //executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" SEULEMENT SI PUPPETEER CORE
        };

        this.browser = await puppeteer.launch(launchOptions);
    }

    async close() {
        this.browser.close();
        this.browser = null;
    }
}

module.exports = Browser;