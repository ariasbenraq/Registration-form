export const enviarRegistro = async (data) => {
    await fetch('https://script.google.com/macros/s/AKfycbzAWH-4uvqSbOxGlq2vCapXpRXUDtdUT1hGS1fMoi-V23RMVfu1VB1BR684VXl_SBO1cw/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };
  