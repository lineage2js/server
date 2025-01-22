const Server = require('./LoginServer/Server');
const database = require('./Database');
const config = require('./config');
const server = new Server();

async function run() {
  try {
    await database.connect(config.database.host, config.database.dbname, () => {
      console.log("database connected: success");
    });
  } catch(e) {
    console.log(e.message);

    return;
  }

  try {
    server.start(config.loginserver.host, config.loginserver.port, () => {
      // console.log('\n');
      // console.log('########################################');
      // console.log('# lineage2js                           #');
      // console.log('# login server                         #');
      // console.log('# Chronicle ....... %s                 #', 'C1');
      // console.log('# Protocol ........ %d                #', 419);
      // console.log('########################################');
      // console.log('\n');
    });
  } catch {

  }
}

run();