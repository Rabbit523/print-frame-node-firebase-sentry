import http from 'http';
import config from './config';
import { cron } from './runCron';
import app from './server';
import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({ dsn: 'https://fec2a66679b04d18978dbe303856a163@sentry.io/2924823' });
  console.log('sentry started');
}

cron.start();

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log('server listening on port ' + config.port);
});
