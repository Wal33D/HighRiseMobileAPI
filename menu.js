const readline = require('readline');
const HighriseAPI = require('./HighriseAPI');
const api = new HighriseAPI();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const menuOptions = [
  {number: '1', description: 'Get account info', action: () => api.getAccountInfo()},
  {number: '2', description: 'Get items', action: () => api.getItems(0, 9999, 'date_descending', 'all', ['epic', 'rare', 'common', 'uncommon', 'legendary'])},
  {number: '3', description: 'Get custom currencies', action: () => api.getCustomCurrencies()},
  {number: '4', description: 'Create a new bot', action: createBot},
  {number: '5', description: 'Get bots', action: () => api.getBots()},
  {number: '6', description: 'Create an API token', action: createApiToken},
  {number: '7', description: 'Get Bot API Keys', action: () => api.getBotAPIKeys()},
  {number: '8', description: 'Get active sale', action: () => api.getActiveSale()},
  {number: '9', description: 'Get user posts', action: getUserPosts},
  {number: '10', description: 'Get user profile', action: getUserProfile},
  {number: '11', description: 'Get land parcels', action: () => api.getLandParcels()},
  {number: '12', description: 'Exit', action: () => process.exit()},
];

function displayMenu() {
  console.log('Select an option:');
  menuOptions.forEach(option => console.log(`${option.number}. ${option.description}`));
}

async function handleChoice(choice) {
  const selectedOption = menuOptions.find(option => option.number === choice);
  if (selectedOption) {
    const result = await selectedOption.action();
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('Invalid choice');
  }
  displayMenu();
}

async function createBot() {
  const username = await askQuestion('Enter bot username: ');
  const result = await api.createBot(username);
  console.log(result);
  displayMenu();
}

async function createApiToken() {
  const botId = await askQuestion('Enter bot ID: ');
  const result = await api.createApiToken(botId);
  console.log(result);
  displayMenu();
}

async function getUserPosts() {
  const userId = await askQuestion('Enter user ID: ');
  const result = await api.getUserPosts(userId);
  console.log(JSON.stringify(result, null, 2));
  displayMenu();
}

async function getUserProfile() {
  const username = await askQuestion('Enter username: ');
  const result = await api.getUserProfile(username);
  console.log(JSON.stringify(result, null, 2));
  displayMenu();
}

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer));
  });
}

async function start() {
  displayMenu();
  for await (const choice of rl) {
    await handleChoice(choice);
  }
}

start();
