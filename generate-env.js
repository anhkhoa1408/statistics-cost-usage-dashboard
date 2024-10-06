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

fs.writeFile(
  "./src/environments/environment.ts",
  environmentFileContent,
  (err) => {
    if (err) {
      console.error("Error writing environment.ts", err);
    } else {
      console.log(`environment.ts generated successfully`);
    }
  }
);
