const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');
const readline = require('readline');

const url = 'https://dichvusocks.net/search&act=SearchAll&page=1';
const payload = {
  country: 'United States',
  region: 'All',
  city: 'All',
  yn: 'All',
  useType: 'Residential'
};

// Fungsi untuk menulis hasil ke file
function writeResultsToFile(data) {
  // Format data untuk disimpan ke file dengan baris baru setelah setiap nilai
  const formattedData = data.map(socks => socks.socks5Proxy + '\n').join('');
  
  // Menambahkan data ke file (append) tanpa menghapus data yang sudah ada
  fs.appendFileSync('result.txt', formattedData, 'utf8');
  console.log('Hasil berhasil ditambahkan ke result.txt');
}
// Replace with your cookies from the Cookie Editor
const cookies = [
[
{
    "domain": ".github.com",
    "expirationDate": 1726121269.867154,
    "hostOnly": false,
    "httpOnly": false,
    "name": "_octo",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "GH1.1.1591845334.1710569269",
    "id": 1
},
{
    "domain": ".github.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "color_mode",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "%7B%22color_mode%22%3A%22dark%22%2C%22light_theme%22%3A%7B%22name%22%3A%22light%22%2C%22color_mode%22%3A%22light%22%7D%2C%22dark_theme%22%3A%7B%22name%22%3A%22dark%22%2C%22color_mode%22%3A%22dark%22%7D%7D",
    "id": 2
},
{
    "domain": ".github.com",
    "expirationDate": 1726121297.287541,
    "hostOnly": false,
    "httpOnly": true,
    "name": "dotcom_user",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "Geoveza",
    "id": 3
},
{
    "domain": ".github.com",
    "expirationDate": 1726121297.287519,
    "hostOnly": false,
    "httpOnly": true,
    "name": "logged_in",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "yes",
    "id": 4
},
{
    "domain": ".github.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "preferred_color_mode",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "dark",
    "id": 5
},
{
    "domain": ".github.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "tz",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "Asia%2FJakarta",
    "id": 6
},
{
    "domain": "github.com",
    "expirationDate": 1716863615.329029,
    "hostOnly": true,
    "httpOnly": true,
    "name": "__Host-user_session_same_site",
    "path": "/",
    "sameSite": "strict",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "efYIhPULUdTdJvB6ZvtHXyasUnWsVHDYJl5FwpDKlNBNf_zK",
    "id": 7
},
{
    "domain": "github.com",
    "expirationDate": 1726121271.437522,
    "hostOnly": true,
    "httpOnly": true,
    "name": "_device_id",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "237ae8ffb8c06daa6900829f9cf3625d",
    "id": 8
},
{
    "domain": "github.com",
    "hostOnly": true,
    "httpOnly": true,
    "name": "_gh_sess",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "6s2quX6eRSAkCV2q6ORF9%2BU7JtiHP87YLoKyUiSLtBLAxrQFpV3crsWyKKOBSrcPNKaPVRGqt%2F0lpkSp7%2FbF2gJ7igNinZKOvTwXhfui1q%2BUlsc7nKwh7cUxL1jdEK1%2FC%2FplcZ4DaPOZV%2B1as6N7H5pkTdXL1ynahLgQsleMIjpzigWvIFMBGn8mnICvZM4qVQilWMOwK23cNu%2FPLo32QlEC3ajJH3eluzl%2FhKdlhX6J3WBZlBiGRgKDFWKjFrt6OWhd6TOKvaBpdmpKELMlboqaOgy5aOu4NM1lSjbzIisFxZ71NnwtOhsf9KmaeXz1gsQEBHNk6%2F2bmMTrNTwxxYNhvW2LdM4ZWHaTuT8MbDwRuZEOOhaT5XDoxWi0rXnT7new%2FjMvrNIOmqMfqD%2Fruars7YYBxdGFg58V21zOZoZk4NF%2B25yt%2Fdw8Ay2DqqrXnYg2Z8ogLeZfl0K18xmtTl9DtpY%2FdXZmoyAen3Z4PPHdCIqVC8OlEn4bDiBSri7DnL%2B1Io7qtpkvuWBI%2F8N3k9iRPwwXMuIhRul0e%2FrM6%2FagWShFyR4TOJP%2F7OEt0Dn%2Bu1tftM7Mg2TCm43qNCgrn3bxIEULB0efU4AnYsxxde7esEhSp8PVUiCtTki9xpfWKN9v62h1gCz%2F%2B7yfkTJAUU104Q%2FgtwnU1dxng96Aiz2sOprmQ0235nI4hsOOboJI%2FpSGpN%2F0wFWfu6aZH%2BjN36gd38aIlIb3MCMsnU%2F86kMcubD9oib8UR7dmj3lKrmPu7cUG1%2BwBP0%2B0eirIiqDDeUYcGPdhM20--0jTxBtEO9l5Nv%2B7D--hR44kXCEC3mQ0YOpDLV%2BZA%3D%3D",
    "id": 9
},
{
    "domain": "github.com",
    "expirationDate": 1715667455.42566,
    "hostOnly": true,
    "httpOnly": true,
    "name": "has_recent_activity",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "1",
    "id": 10
},
{
    "domain": "github.com",
    "expirationDate": 1718345297.287377,
    "hostOnly": true,
    "httpOnly": true,
    "name": "saved_user_sessions",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "34395423%3AefYIhPULUdTdJvB6ZvtHXyasUnWsVHDYJl5FwpDKlNBNf_zK",
    "id": 11
},
{
    "domain": "github.com",
    "hostOnly": true,
    "httpOnly": true,
    "name": "tz",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "Asia%2FJakarta",
    "id": 12
},
{
    "domain": "github.com",
    "expirationDate": 1716863615.32896,
    "hostOnly": true,
    "httpOnly": true,
    "name": "user_session",
    "path": "/",
    "sameSite": "lax",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "efYIhPULUdTdJvB6ZvtHXyasUnWsVHDYJl5FwpDKlNBNf_zK",
    "id": 13
}
]
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
async function scrapeData() {
  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Cookie': cookieHeader
      }
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const totalView = document.getElementById('totalView').textContent;
    console.log(`Used today: ${totalView}`);

    const table = document.querySelector('.sockslist__table tbody');
    const rows = table.querySelectorAll('tr');

    const data = [];
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const viewSocksId = cells[0].querySelector('a').getAttribute('onclick').match(/\d+/)[0];
      const ipAddress = cells[0].textContent.trim();
      const country = cells[1].textContent.trim();
      const type = cells[10].textContent.trim();

      // Check if type is "hosting" or "Business", if so, skip this entry
      if (type !== "Hosting" && type !== "Business") {
        data.push({
          viewSocksId,
          ipAddress,
          country,
          type
        });
      }
    });

    console.log('Socks Found: Total', data.length);

    rl.question('How many socks do you want? ', async (numSocks) => {
      const results = [];
      for (let i = 0; i < numSocks && i < data.length; i++) {
        const { viewSocksId, ipAddress, country, type } = data[i];
        console.log(`Accessing viewsocks for ${ipAddress} | ${country} | ${type}` );

        const viewSocksUrl = `https://dichvusocks.net/viewsocks&id=${viewSocksId}`;
        const viewSocksResponse = await axios.get(viewSocksUrl, {
          headers: {
            'Cookie': cookieHeader
          }
        });

        const viewSocksHTML = viewSocksResponse.data;
        const ipPortRegex = /show_socks_info\(\d+,"([^"]+)","([^"]+)"/;
        const match = viewSocksHTML.match(ipPortRegex);

        if (match) {
          const [, ip, port] = match;
          const socks5Proxy = `socks5://${ip}:${port}`;
          console.log(`IP:Port for ${ipAddress}: ${socks5Proxy}`);
          results.push({ipAddress, socks5Proxy}); // Menyimpan hasil ke array
        } else {
          console.log(`Failed to extract IP:Port for ${ipAddress}`);
		          console.log("Response HTML:", viewSocksHTML);
        }
      }
      writeResultsToFile(results); // Menulis hasil ke file
      rl.close();
    });
  } catch (error) {
    console.error(error);
  }
}

scrapeData();
