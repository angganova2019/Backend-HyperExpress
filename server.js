import { Server } from 'hyper-express';
import { api_router } from './routes.js';
const webserver = new Server();

webserver.use('/', api_router);

webserver.listen(3030)
    .then((socket) => console.log('Webserver started on port 80'))
    .catch((error) => console.log('Failed to start webserver on port 80'));