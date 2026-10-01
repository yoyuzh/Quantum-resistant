'use strict';

const TOKEN_HEADER = 'X-Quantum-Desktop-Token';
function localURL(value, origin) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' && url.origin === origin && !url.username && !url.password;
  } catch { return false; }
}
function externalURL(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password &&
      (!url.port || url.port === '443') && ['csrc.nist.gov', 'www.nist.gov', 'nist.gov'].includes(url.hostname);
  } catch { return false; }
}
function requestHeaders(headers, value, origin, token) {
  const output = Object.fromEntries(Object.entries(headers).filter(([key]) => key.toLowerCase() !== TOKEN_HEADER.toLowerCase()));
  if (localURL(value, origin)) output[TOKEN_HEADER] = token;
  return output;
}
function trustedFrame(event, webContents, origin) {
  return event.sender === webContents && event.senderFrame === webContents.mainFrame &&
    localURL(event.senderFrame?.url, origin);
}
function validTheme(value) { return value === 'light' || value === 'dark'; }
module.exports = { TOKEN_HEADER, localURL, externalURL, requestHeaders, trustedFrame, validTheme };
