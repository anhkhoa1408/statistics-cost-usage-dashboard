const fs = require("fs");
const dotenv = require("dotenv");

const envFilePath = `.env`;
dotenv.config({ path: envFilePath });

console.log(`Loaded environment from ${envFilePath}`);

const environmentFileContent = `
export const environment = {
  firebaseConfig: {
    apiKey: '${process.env.NG_FB_API_KEY}',
    authDomain: '${process.env.NG_FB_AUTH_DOMAIN}',
    projectId: '${process.env.NG_FB_PROJECT_ID}',
    storageBucket: '${process.env.NG_FB_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.NG_FB_MESSAGING_SENDER_ID}',
    appId: '${process.env.NG_FB_APP_ID}',
    measurementId: '${process.env.NG_FB_MEASUREMENT_ID}',
  },
};
`;

const filePath = "./src/environments/environment.ts";
const fileDir = "./src/environments";

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(fileDir);
}

fs.writeFileSync("./src/environments/environment.ts", environmentFileContent);
