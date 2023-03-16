const fs = require('fs');
const fetch = require('node-fetch');

class HighriseAPI {
    constructor(cookieFile = "cookie.json") {
        this.headers = {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Cookie": ""
        };
        this.endpoint = "https://highrise.game/web/api";

        // Read the cookie from the specified file
        const cookieData = fs.readFileSync(cookieFile);
        const cookieJson = JSON.parse(cookieData);
        this.headers.Cookie = cookieJson.cookie;
    }

    async getData(requestBody) {
        try {
            const response = await fetch(this.endpoint, {
                method: "POST",
                headers: this.headers,
                body: requestBody,
                credentials: "include",
                mode: "cors"
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return error;
        }
    }

    async getAccountInfo() {
        const requestBody = JSON.stringify({
            "_type": "GetAccountInfoRequest"
        });
        return await this.getData(requestBody);
    }

    async getItems(page = 0, limit = 20, sort = 'date_descending', type = 'all', rarity = []) {
        const requestBody = JSON.stringify({
            "_type": "GetNextjsItemsRequest",
            "page": page,
            "limit": limit,
            "sort": sort,
            "type": type,
            "rarity": rarity
        });
        return await this.getData(requestBody);
    }

    async getCustomCurrencies() {
        const response = await fetch("https://cdn.highrisegame.com/item-descriptors/en/custom_currencies.json", {
            "headers": {
                "accept": "/",
                "accept-language": "en-US,en;q=0.9",
            },
            "referrer": "https://highrise.game/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        });
        const data = await response.json();
        return data;
    }

}

module.exports = HighriseAPI;