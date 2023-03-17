const HighriseAPI = require('./HighriseAPI');
const api = new HighriseAPI();

function displayMenu() {
    console.log('Select an option:');
    console.log('1. Get account info');
    console.log('2. Get items');
    console.log('3. Get custom currencies');
    console.log('4. Create a new bot');
    console.log('5. Get bots');
    console.log('6. Create an API token');
    console.log('7. Get Bot API Keys');
    console.log('8. Exit');
}

async function handleChoice(choice) {
    switch (choice) {
        case '1':
            const accountInfo = await api.getAccountInfo();
            console.log(accountInfo);
            break;
        case '2':
            const items = await api.getItems(0, 9999, 'date_descending', 'all', ['epic', 'rare', 'common', 'uncommon', 'legendary']);
            console.log(items);
            break;
        case '3':
            const customCurrencies = await api.getCustomCurrencies();
            console.log(customCurrencies);
            break;
        case '4':
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question('Enter bot username: ', async(username) => {
                const result = await api.createBot(username);
                readline.close();
                console.log(result);
                displayMenu();
            });
            return;
        case '5':
            const botList = await api.getBots();
            console.log(JSON.stringify(botList, null, 2));
            break;
        case '6':
            const readlineApi = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readlineApi.question('Enter bot ID: ', async(botId) => {
                const result = await api.createApiToken(botId);
                readlineApi.close();
                console.log(result);
                displayMenu();
            });
            return;
        case '7':
            const botAPIKeys = await api.getBotAPIKeys();
            console.log(JSON.stringify(botAPIKeys, null, 2));
            break;
        case '8':
            console.log('Exiting...');
            process.exit();
            break;
        default:
            console.log('Invalid choice');
            break;
    }
    displayMenu();
}

function promptUser() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: null
    });
    readline.question('Enter your choice: ', async(choice) => {
        await handleChoice(choice);
        readline.close();
        promptUser();
    });
}

displayMenu();
promptUser();