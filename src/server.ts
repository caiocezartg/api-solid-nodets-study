import { app } from './app';
import { env } from './env/config';

app.listen({
  port: env.PORT,
  host: '0.0.0.0',
}).then((port) => {
  console.log('Server is running! ' + port);
});