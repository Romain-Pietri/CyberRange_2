// Fonction pour définir un cookie de session
export const setSessionCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
  console.log(`Cookie défini : ${name}=${value}`); // Vérifiez ici si le cookie est défini
};

// Fonction pour récupérer un cookie
export const getSessionCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
          return cookie.substring(name.length + 1);
      }
  }
  return null;
};

// Fonction pour supprimer un cookie
export const deleteSessionCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;Secure;HttpOnly`;
};