const Server = require('./GameServer/Server');
const npcs = require('./GameServer/Models/Npcs');
const database = require('./Database');
const config = require('./config');
const serverStatus = require('./enums/serverStatus');
const serverTypes = require('./enums/serverTypes');
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
    server.start(config.gameserver.host, config.gameserver.port, async () => {
      // console.log('\n');
      // console.log('########################################');
      // console.log('# lineage2js                           #');
      // console.log('# game server                          #');
      // console.log('# Chronicle ....... %s                 #', 'C1');
      // console.log('# Protocol ........ %d                #', 419);
      // console.log('########################################');
      // console.log('\n');

      const isGameServerExists = await database.checkGameServerExistsById(config.gameserver.id);
      
      if (!isGameServerExists) {
        await database.addGameServer({
          id: config.gameserver.id, 
          host: config.gameserver.host,
          port: config.gameserver.port,
          ageLimit: config.gameserver.ageLimit,
          isPvP: config.gameserver.isPvP,
          maxPlayers: config.gameserver.maxPlayers,
          status: serverStatus.STATUS_DOWN,
          type: serverTypes.SERVER_NORMAL
        });
      }

      const gameserver = await database.getGameServerById(config.gameserver.id);

      await database.updateGameServerById(gameserver.id, "status", serverStatus.STATUS_UP);

      npcs.spawn();
    });
  } catch {

  }
}

process.stdin.resume();
process.on('SIGINT', async () => {
  const gameserver = await database.getGameServerById(config.gameserver.id);

  await database.updateGameServerById(gameserver.id, "status", serverStatus.STATUS_DOWN);

  process.exit(0);
});

run();