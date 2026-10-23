// ======================= CONFIGURAÇÃO =======================
// Textos exibidos no site
const BABY_NAME = 'Soso';
const TITLE = BABY_NAME + ' faz 1 aninho!';
const TIMEZONE = 'America/Sao_Paulo';

// Pasta do Google Drive onde as fotos serão salvas. Deixe vazio para
// criar automaticamente uma pasta chamada FOLDER_NAME no seu Drive.
const FOLDER_ID = '';
const FOLDER_NAME = 'Fotos - ' + TITLE;
// ============================================================

function getFolder() {
  if (FOLDER_ID) return DriveApp.getFolderById(FOLDER_ID);

  const props = PropertiesService.getScriptProperties();
  const cached = props.getProperty('folderId');
  if (cached) return DriveApp.getFolderById(cached);

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const id = props.getProperty('folderId');
    if (id) return DriveApp.getFolderById(id);
    const folder = DriveApp.createFolder(FOLDER_NAME);
    props.setProperty('folderId', folder.getId());
    return folder;
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  getFolder();
  const t = HtmlService.createTemplateFromFile('Index');
  t.title = TITLE;
  t.babyName = BABY_NAME;
  return t.evaluate()
    .setTitle(TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * API usada pelo site hospedado fora do Google (docs/index.html).
 * Corpo: JSON {image: dataUrl, name: string}, enviado como text/plain
 * para não exigir preflight de CORS.
 */
function doPost(e) {
  let result;
  try {
    const body = JSON.parse(e.postData.contents);
    result = { ok: true, file: uploadPhoto(body.image, body.name) };
  } catch (err) {
    result = { ok: false, error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Recebe uma foto em base64 (data URL) e salva na pasta do Drive.
 */
function uploadPhoto(dataUrl, guestName) {
  const match = /^data:([\w\/+.-]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) throw new Error('Arquivo inválido');

  const mime = match[1];
  if (mime.indexOf('image/') !== 0) throw new Error('Apenas imagens são aceitas');

  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/heic': 'heic', 'image/heif': 'heif', 'image/webp': 'webp' }[mime] || 'jpg';
  const stamp = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd_HH-mm-ss');
  const who = sanitize(guestName) || 'convidado';
  const rand = Math.random().toString(36).slice(2, 6);
  const fileName = stamp + '_' + who + '_' + rand + '.' + ext;

  const blob = Utilities.newBlob(Utilities.base64Decode(match[2]), mime, fileName);
  getFolder().createFile(blob);
  return fileName;
}

function sanitize(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40);
}
