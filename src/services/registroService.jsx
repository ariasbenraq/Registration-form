export const enviarRegistro = async (data) => {
    await fetch('https://script.google.com/macros/s/AKfycbx1bGdhqGr6dl1VZEeyEMnH_xK91iDDaS5GYiaBPTQ_YWPsGopFZZi_G6-XVaZqJujXtw/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };
  