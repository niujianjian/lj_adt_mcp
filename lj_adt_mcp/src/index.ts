import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "..", ".env") });
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp-server.js";
import { AdtConfig, buildBaseUrl } from "./types.js";

function loadConfig(): AdtConfig {
  const hostname = process.env.SAP_HOSTNAME;
  const sysnr = process.env.SAP_SYSNR;
  const username = process.env.SAP_USERNAME;
  const password = process.env.SAP_PASSWORD;
  const client = process.env.SAP_CLIENT;

  if (!hostname || !sysnr || !username || !password || !client) {
    console.error("Missing required environment variables.");
    console.error("Required: SAP_HOSTNAME, SAP_SYSNR, SAP_USERNAME, SAP_PASSWORD, SAP_CLIENT");
    console.error("Copy .env.example to .env and fill in your SAP system details.");
    process.exit(1);
  }

  const language = process.env.SAP_LANGUAGE || "EN";
  const useHttps = process.env.USE_HTTPS !== "false";

  return { hostname, sysnr, username, password, client, language, useHttps };
}

async function main() {
  const config = loadConfig();
  const server = createMcpServer(config);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`SAP ADT MCP server started (${buildBaseUrl(config)} client ${config.client})`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
