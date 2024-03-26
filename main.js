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
paste cookiesnya
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
