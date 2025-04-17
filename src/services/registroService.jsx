export const enviarRegistro = async (data) => {
    await fetch('https://script.google.com/macros/s/AKfycbxE9wKVihifygcycSoaCWT02EnRKwWRPiNqQMXyKgiHR7h8qBu7dCwfGSZHEu_TOeFi6A/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };
  