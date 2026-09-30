/**
 * Yeni bir cookie oluşturur veya var olanı günceller.
 * @param {string} name - Cookie'nin adı
 * @param {string} value - Cookie'nin değeri
 * @param {number} days - Geçerlilik süresi (gün)
 */
export const setCookie = (name, value, days = 7) => {
  let expires = "";
  
  if (days) {
    const date = new Date();
    // Günü milisaniyeye çevirip şu anki zamana ekliyoruz
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  
  // Güvenlik için 'Secure' ve 'SameSite=Strict' parametreleri eklendi.
  // Not: Geliştirme ortamında (localhost) 'Secure' bayrağı bazen HTTP'de çalışmayabilir, 
  // ortam bazlı (NODE_ENV) dinamik yapabilirsiniz.
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Strict; Secure`;
};

/**
 * Adı verilen cookie'nin değerini döndürür.
 * @param {string} name - Aranacak cookie'nin adı
 * @returns {string|null} - Cookie değeri veya bulunamazsa null
 */
export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    
    // Başlangıçtaki boşlukları temizle
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    
    // Eşleşme varsa decode ederek değeri dön
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  
  return null;
};

/**
 * Adı verilen cookie'yi siler.
 * @param {string} name - Silinecek cookie'nin adı
 */
export const removeCookie = (name) => {
  // Geçerlilik tarihini geçmiş bir zaman yaparak tarayıcının silmesini sağlıyoruz
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Tüm çerezleri temizler. (Opsiyonel toplu silme işlemi)
 */
export const clearAllCookies = () => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};
