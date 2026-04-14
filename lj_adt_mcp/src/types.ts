export interface AdtConfig {
  hostname: string;
  sysnr: string;
  username: string;
  password: string;
  client: string;
  language: string;
  useHttps: boolean;
}

export function buildBaseUrl(config: AdtConfig): string {
  const protocol = config.useHttps ? "https" : "http";
  
  const colonIndex = config.hostname.indexOf(":");
  if (colonIndex > -1) {
    return `${protocol}://${config.hostname}`;
  }
  
  const sysnrNum = parseInt(config.sysnr, 10);
  const port = config.useHttps ? 50000 + sysnrNum + 1 : 50000 + sysnrNum;
  return `${protocol}://${config.hostname}:${port}`;
}
