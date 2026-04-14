import dotenv from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import https from "https";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, ".env") });

async function testConnection() {
  const hostname = process.env.SAP_HOSTNAME || "";
  const sysnr = process.env.SAP_SYSNR || "";
  const username = process.env.SAP_USERNAME || "";
  const password = process.env.SAP_PASSWORD || "";
  const client = process.env.SAP_CLIENT || "";
  const useHttps = process.env.USE_HTTPS !== "false";

  console.log(`Configuration:`);
  console.log(`  Hostname: ${hostname}`);
  console.log(`  Sysnr: ${sysnr}`);
  console.log(`  Username: ${username}`);
  console.log(`  Password: ${password ? "***" : ""}`);
  console.log(`  Client: ${client}`);
  console.log(`  Use HTTPS: ${useHttps}`);

  const sysnrNum = parseInt(sysnr, 10);
  const port = useHttps ? 50000 + sysnrNum + 1 : 50000 + sysnrNum;
  const baseUrl = `${useHttps ? "https" : "http"}://${hostname}:${port}`;

  console.log(`\nBase URL: ${baseUrl}`);

  const http = axios.create({
    baseURL,
    headers: { "sap-client": client },
    auth: { username, password },
    httpsAgent: useHttps ? new https.Agent({ rejectUnauthorized: false }) : undefined,
    timeout: 30000,
  });

  try {
    console.log("\nTesting ADT connection...");
    const response = await http.get("/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=ZTLJ_H_01&maxResults=10", {
      headers: { Accept: "*/*" },
      responseType: "text",
    });
    console.log("Success! Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log("Response body (first 1000 chars):", response.data.substring(0, 1000));
  } catch (error: any) {
    console.error("\nError:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response status text:", error.response.statusText);
      console.error("Response headers:", error.response.headers);
      if (error.response.data) {
        console.error("Response data:", String(error.response.data).substring(0, 2000));
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    }
  }
}

testConnection();
