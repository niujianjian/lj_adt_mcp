require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const axios = require('axios');
const https = require('https');

async function testConnection() {
  const hostname = process.env.SAP_HOSTNAME || '';
  const sysnr = process.env.SAP_SYSNR || '';
  const username = process.env.SAP_USERNAME || '';
  const password = process.env.SAP_PASSWORD || '';
  const client = process.env.SAP_CLIENT || '';
  const useHttps = process.env.USE_HTTPS !== 'false';

  console.log('Configuration:');
  console.log('  Hostname:', hostname);
  console.log('  Sysnr:', sysnr);
  console.log('  Username:', username);
  console.log('  Password (raw):', password);
  console.log('  Password length:', password ? password.length : 0);
  console.log('  Client:', client);
  console.log('  Use HTTPS:', useHttps);

  const sysnrNum = parseInt(sysnr, 10);
  const port = useHttps ? 50000 + sysnrNum + 1 : 50000 + sysnrNum;
  const baseUrl = `${useHttps ? 'https' : 'http'}://${hostname}:${port}`;

  console.log('\nBase URL:', baseUrl);

  const http = axios.create({
    baseURL: baseUrl,
    headers: { 'sap-client': client },
    httpsAgent: useHttps ? new https.Agent({ rejectUnauthorized: false }) : undefined,
    timeout: 30000,
  });
  
  http.defaults.auth = { username, password };
  
  console.log('\nTesting with manual Authorization header...');
  const authHeader = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
  console.log('Authorization header:', authHeader.substring(0, 50) + '...');

  try {
    console.log('\nTesting ADT connection with auth config...');
    const response = await http.get('/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=ZTLJ_H_01&maxResults=10', {
      headers: { Accept: '*/*' },
      responseType: 'text',
    });
    console.log('Success! Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response body (first 1000 chars):', response.data.substring(0, 1000));
  } catch (error) {
    console.error('\nError with auth config:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response status text:', error.response.statusText);
      console.error('Response headers:', error.response.headers);
    }
    
    console.log('\nTrying with manual Authorization header...');
    try {
      const response2 = await axios.get(baseUrl + '/sap/bc/adt/repository/informationsystem/search?operation=quickSearch&query=ZTLJ_H_01&maxResults=10', {
        headers: { 
          Accept: '*/*',
          'sap-client': client,
          Authorization: authHeader
        },
        httpsAgent: useHttps ? new https.Agent({ rejectUnauthorized: false }) : undefined,
        timeout: 30000,
        responseType: 'text',
      });
      console.log('Success with manual auth! Response status:', response2.status);
      console.log('Response body (first 500 chars):', response2.data.substring(0, 500));
    } catch (error2) {
      console.error('\nError with manual auth:', error2.message);
      if (error2.response) {
        console.error('Response status:', error2.response.status);
        console.error('Response status text:', error2.response.statusText);
        console.error('Response headers:', error2.response.headers);
      }
    }
  }
}

testConnection();
