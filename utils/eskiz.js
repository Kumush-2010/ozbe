// utils/eskiz.js
const axios = require('axios');
let cachedToken = null;

async function getEskizToken() {
  if (cachedToken) return cachedToken;

  // const { ESKIZ_EMAIL, ESKIZ_PASSWORD } = process.env;

  try {
    const res = await axios.post('https://notify.eskiz.uz/api/auth/login', {
      email: ESKIZ_EMAIL,
      password: ESKIZ_PASSWORD
    });

    cachedToken = res.data.data.token;
    return cachedToken;
  } catch (err) {
    console.error('❌ ESKIZ token olishda xatolik:', err.response?.data || err.message);
    throw new Error('Token olishda muammo');
  }
}

async function sendSMS(phone, code) {
  if (process.env.SEND_REAL_SMS !== 'true') {
    console.log(`📲 [TEST] ${phone} uchun kod: ${code}`);
    return;
  }

  try {
    const token = await getEskizToken();

    await axios.post(
      'https://notify.eskiz.uz/api/message/sms/send',
      {
        mobile_phone: phone,
        message: `Limon.uz saytidagi telefon raqamingizni tasdiqlash kodi ${code}`,
        from: '4546',
        callback_url: ''
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log(`✅ SMS yuborildi: ${phone}`);
  } catch (err) {
    console.error('❌ SMS yuborishda xatolik:', err.response?.data || err.message);
  }
    console.log(`📲 [TEST] ${phone} uchun kod: ${code}`);
}

module.exports = sendSMS;

