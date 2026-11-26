// Zdjęcia sylwetki przy pomiarach klienta (prośba właściciela 2026-11-26): wyłącznie za osobną zgodą klienta
// (client.photoConsent { given, date }). Zdjęcie jest zmniejszane do 1280 px (JPEG 0,8) i trafia do sejfu jako
// zaszyfrowany opis measurement_photo { clientId, measurementId, date, pose, mime, width, height, bytes, blobId }
// i blob z treścią (czytany dopiero do wyświetlenia). Nigdy w localStorage, zwykłym IndexedDB ani na dysku.

export const PHOTO_KIND = 'measurement_photo';
export const MAX_SIDE = 1280;
export const JPEG_QUALITY = 0.8;

export const POSES = [
    { id: 'przod', label: 'Przód' },
    { id: 'bok', label: 'Bok' },
    { id: 'tyl', label: 'Tył' },
];

export const poseLabel = (id) => (POSES.find((p) => p.id === id) || { label: id }).label;

export function hasPhotoConsent(client) {
    return !!(client && client.photoConsent && client.photoConsent.given === true);
}

// Wymiary po zmniejszeniu: dłuższy bok najwyżej MAX_SIDE, bez powiększania.
export function fitSize(width, height, max = MAX_SIDE) {
    const scale = Math.min(1, max / Math.max(width, height));
    return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

async function decode(file) {
    if (typeof createImageBitmap === 'function') {
        try {
            const bmp = await createImageBitmap(file);
            return { source: bmp, width: bmp.width, height: bmp.height, done: () => bmp.close && bmp.close() };
        } catch (e) { /* niżej przez <img> */ }
    }
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        img.src = url;
        await img.decode();
        return { source: img, width: img.naturalWidth, height: img.naturalHeight, done: () => {} };
    } finally {
        URL.revokeObjectURL(url);
    }
}

// Plik z aparatu albo galerii → { blob (image/jpeg), width, height }. Błąd: NIE_ZDJECIE.
export async function downscale(file) {
    let img;
    try {
        img = await decode(file);
    } catch (e) {
        throw new Error('NIE_ZDJECIE');
    }
    try {
        const { width, height } = fitSize(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img.source, 0, 0, width, height);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
        if (!blob) throw new Error('NIE_ZDJECIE');
        canvas.width = 0;
        canvas.height = 0;
        return { blob, width, height };
    } finally {
        img.done();
    }
}
