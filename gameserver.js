const Server = require('./GameServer/Server');
const database = require('./Database');
const npcs = require('./GameServer/Models/Npcs');
const server = new Server();

async function run() {
  try {
    await database.connect(() => {
      console.log("database connected: success");
    });
  } catch(e) {
    console.log(e.message);

    return;
  }

  try {
    server.start(() => {
      // console.log('\n');
      // console.log('########################################');
      // console.log('# lineage2js                           #');
      // console.log('# game server                          #');
      // console.log('# Chronicle ....... %s                 #', 'C1');
      // console.log('# Protocol ........ %d                #', 419);
      // console.log('########################################');
      // console.log('\n');

      npcs.spawn();
    });
  } catch {

  }
}

run();