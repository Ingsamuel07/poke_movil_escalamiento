const https = require('https');
const fs = require('fs');

function fetchUrl(targetUrl) {
  const parsed = new URL(targetUrl);
  const options = {
    hostname: parsed.hostname,
    path: parsed.pathname + parsed.search,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
    }
  };

  https.get(options, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Redirecting to:', res.headers.location);
      return fetchUrl(res.headers.location.startsWith('http') ? res.headers.location : `https://${parsed.hostname}${res.headers.location}`);
    }

    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      fs.writeFileSync('linkedin_page.html', data);
      console.log('Status code:', res.statusCode);
      const m1 = data.match(/property="og:image"\s+content="([^"]+)"/i);
      const m2 = data.match(/https:\/\/media\.licdn\.com\/dms\/image\/[^\s"'<>]+/i);
      console.log('og:image:', m1 ? m1[1] : 'null');
      console.log('media.licdn.com:', m2 ? m2[0] : 'null');
    });
  }).on('error', err => console.error(err));
}

fetchUrl('https://www.linkedin.com/in/elfar-didier-morantes-s%C3%A1nchez/');
