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
        const response = await this.getData(requestBody);
        return response;
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
        const response = await this.getData(requestBody);
        return response;
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

    async createBot(name) {
        const requestBody = JSON.stringify({
            _type: 'CreateBotRequest',
            username: name,
        });
        const response = await this.getData(requestBody);
        return response;
    }

    async getBots() {
        const requestBody = JSON.stringify({
            _type: 'GetBotsRequest'
        });

        const response = await this.getData(requestBody);
        return response;
    }

    async createApiToken(botId) {
        const requestBody = JSON.stringify({
            "_type": "CreateApiTokenRequest",
            "bot_id": botId
        });
        const response = await this.getData(requestBody);
        return response;
    }

    async getBotAPIKeys() {
        const botList = await this.getBots();
        const credentials = [];

        botList.user_infos.forEach((user) => {
            if (user[1] && typeof user[1] === 'string') {
                credentials.push({
                    user_id: user[0].user_id,
                    username: user[0].username,
                    api_key: user[1]
                });
            }
        });

        return credentials;
    }

    async getActiveSale() {
        const requestBody = JSON.stringify({
            "_type": "GetActiveSaleRequest"
        });
        const response = await this.getData(requestBody);
        return response;
    }

    async getUserPosts(userId) {
        const requestBody = JSON.stringify({
            "_type": "GetUserPostsRequest",
            "user_id": userId
        });
        const response = await this.getData(requestBody);
        return response;
    }

    async getUserProfile(username) {
        const requestBody = JSON.stringify({
            "_type": "GetUserProfileRequest",
            "username": username
        });
        const response = await this.getData(requestBody);
        return response;
    }
    async getLandParcels(limit = 20, offset = 0) {
        const requestBody = JSON.stringify({
            "_type": "GetLandParcelsRequest",
            "limit": limit,
            "offset": offset
        });
        const response = await this.getData(requestBody);
        return response;
    }
}

module.exports = HighriseAPI;