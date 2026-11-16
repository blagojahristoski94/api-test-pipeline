import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const env = process.env.ENV || 'local';
const basePath = path.resolve(__dirname, '../../../');

const getEnvFilePath = (env: string | undefined) => {
  const defaultEnvFilePath = path.resolve(basePath, '.env'); // Default environment file path
  const specificEnvFilePath = env ? path.resolve(basePath, `.env_${env}`) : null;

  // Check for the specific environment file
  if (specificEnvFilePath && fs.existsSync(specificEnvFilePath)) {
    return specificEnvFilePath;
  }

  if (fs.existsSync(defaultEnvFilePath)) {
    return defaultEnvFilePath;
  }
  return;
};

const envFilePath = getEnvFilePath(env);

if (envFilePath) {
  dotenv.config({ path: envFilePath });
} else {
  console.warn('Local environment file not found. Add .env_local file');
}

const config = {
  baseUrl: process.env.BASE_URL,
  defaultTimeout: 20 * 1000,
};

export default config;
