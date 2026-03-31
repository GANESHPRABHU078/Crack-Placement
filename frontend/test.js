const fetch = require('node-fetch');
async function test() {
  const res = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: 'python',
      version: '3.10.0',
      files: [{ content: 'print("Hello from piston")' }]
    })
  });
  console.log(res.status, await res.text());
}
test();
