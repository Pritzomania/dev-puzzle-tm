import { environment } from '../../environments/environment';

const fetch = require('node-fetch');

const pluginName = 'StocksCachePlugin';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

const fetchStockData = async (symbol, period) => {
  const url = `${
    environment.apiURL
  }/beta/stock/${symbol}/chart/${period}?token=${environment.apiKey}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Error while fetching data for symbol - ${symbol}`);
    return [];
  }
};

export const StocksCachePlugin = {
  name: pluginName,
  version: '1.0.0',
  register: async function(server) {
    await server.cache.provision({
      provider: require('@hapi/catbox-memory'),
      name: 'stocks-cache'
    });

    server.method('fetchStockData', fetchStockData, {
      cache: {
        cache: 'stocks-cache',
        expiresIn: MINUTE,
        generateTimeout: 10 * SECOND
      }
    });

    server.route({
      method: 'GET',
      path: '/api/beta/stock/{symbol}/chart/{period}',
      handler: async (request, reply) => {
        const id = request.params.symbol;
        const period = request.params.period;
        try {
          const data = await server.methods.fetchStockData(id, period);
          return data;
        } catch (err) {
          console.error(`Error while fetching data for symbol - ${id}`);
          return [];
        }
      }
    });
  }
};
