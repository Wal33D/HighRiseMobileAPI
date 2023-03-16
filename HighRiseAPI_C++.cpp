#include <iostream>
#include <fstream>
#include <nlohmann/json.hpp>
#include <cpprest/http_client.h>

using json = nlohmann::json;
using namespace web::http::client;

class HighriseAPI {
private:
    std::string cookieFile;
    web::http::http_headers headers;
    std::string endpoint;

    json getData(json requestBody) {
        try {
            http_client client(this->endpoint);
            http_request request(methods::POST);
            request.headers() = this->headers;
            request.set_body(requestBody.dump());
            request.set_credentials(credential_cache());
            request.set_mode(http::client::http_client_config::http_pipeline_stage::try_fastest);
            http_response response = client.request(request).get();
            json data = json::parse(response.extract_string().get());
            return data;
        }
        catch (const std::exception& e) {
            std::cout << "Error occurred: " << e.what() << std::endl;
            return nullptr;
        }
    }

public:
    HighriseAPI(std::string cookieFile = "cookie.json") {
        this->cookieFile = cookieFile;
        this->headers = { {"Content-Type", "application/json"},
                           {"Accept", "*/*"},
                           {"Cookie", ""} };
        this->endpoint = "https://highrise.game/web/api";

        // Read the cookie from the specified file
        std::ifstream i(this->cookieFile);
        json cookieJson;
        i >> cookieJson;
        this->headers.set("Cookie", cookieJson["cookie"]);
    }

    json getAccountInfo() {
        json requestBody = {
            {"_type", "GetAccountInfoRequest"}
        };
        return this->getData(requestBody);
    }

    json getItems(int page = 0, int limit = 20, std::string sort = "date_descending", std::string type = "all", std::vector<std::string> rarity = {}) {
        json requestBody = {
            {"_type", "GetNextjsItemsRequest"},
            {"page", page},
            {"limit", limit},
            {"sort", sort},
            {"type", type},
            {"rarity", rarity}
        };
        return this->getData(requestBody);
    }

    json getCustomCurrencies() {
        http_client client("https://cdn.highrisegame.com");
        http_request request(methods::GET);
        request.headers() = { {"accept", "/"},
                               {"accept-language", "en-US,en;q=0.9"} };
        request.set_request_uri("/item-descriptors/en/custom_currencies.json");
        request.set_mode(http::client::http_client_config::http_pipeline_stage::try_fastest);
        http_response response = client.request(request).get();
        json data = json::parse(response.extract_string().get());
        return data;
    }

    json createBot(std::string name) {
        json requestBody = {
            {"_type", "CreateBotRequest"},
            {"username", name}
        };
        return this->getData(requestBody);
    }

    json getUserProfile(std::string username) {
        json requestBody = {
            {"_type", "GetUserProfileRequest"},
            {"username", username}
        };
        return this->getData(requestBody);
    }
};
