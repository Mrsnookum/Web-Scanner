document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  document.getElementById('currentUrl').innerText = tab.url;

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbylI6FTqPo9O3PZUx7ogCl5FBSpvxdsAglbNA6Aaxu8uDNDJ_A2Jbtklzem7MTVteY/exec';

  document.getElementById('runBtn').addEventListener('click', async () => {
    const btn = document.getElementById('runBtn');
    const loader = document.getElementById('loading');
    const results = document.getElementById('miniResults');

    btn.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ url: tab.url })
      });
      const data = await response.json();

      loader.classList.add('hidden');
      results.classList.remove('hidden');

      document.getElementById('score').innerText = data.score;
      document.getElementById('score').style.color = data.score > 70 ? '#4ade80' : '#f87171';
      document.getElementById('summary').innerText = `Detected ${data.findings.length} vulnerabilities.`;
      
      // Open the main dashboard for a detailed view
      document.getElementById('viewFull').addEventListener('click', () => {
        chrome.tabs.create({ url: 'http://127.0.0.1:5500/SentryScan-Web/index.html' });
      });

    } catch (err) {
      alert("Scan Failed: Check backend connection.");
      btn.classList.remove('hidden');
      loader.classList.add('hidden');
    }
  });
});