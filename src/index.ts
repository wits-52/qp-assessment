import dotenv from 'dotenv';
dotenv.config();

import config from './config';

import { app } from './app/app';

app.listen(config.PORT, (): void => {
    console.log(`server running!! on PORT ${config.PORT}`);
});