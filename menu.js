const HighriseAPI = require('./HighriseAPI');
const api = new HighriseAPI();

function displayMenu() {
    console.log('Select an option:');
    console.log('1. Get account info');
    console.log('2. Get items');
    console.log('3. Get custom currencies');
    console.log('4. Create a new bot');
    console.log('5. Get user profile');
    console.log('6. Exit');
}

async function handleChoice(choice) {
    switch (choice) {
        case '1':
            const accountInfo = await api.getAccountInfo();
            console.log(accountInfo);
            break;
        case '2':
            const items = await api.getItems(0, 9999, 'date_descending', 'all', ['epic', 'rare', 'common', 'uncommon', 'legendary']);
            console.log(items)
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
                console.log(result)
                displayMenu();
            });
            return;
        case '5':
            const readline2 = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline2.question('Enter username: ', async(username) => {
                const userProfile = await api.getUserProfile(username);
                readline2.close();
                console.log(userProfile);
                displayMenu();
            });
            return;
        case '6':
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
