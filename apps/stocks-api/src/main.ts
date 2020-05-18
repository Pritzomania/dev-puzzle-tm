/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { StocksCachePlugin } from './app/plugins/StocksCachePlugin';

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  await server
    .register(StocksCachePlugin)
    .then(() => console.log(`Stocks plugin registered.`));

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
