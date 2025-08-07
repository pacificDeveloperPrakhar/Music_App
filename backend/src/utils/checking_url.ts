import fetch from 'node-fetch';
export function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  

export async function isImageUrl(url: string): Promise<boolean> {
  if (!isValidUrl(url)) return false;

  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type') || '';
    return contentType.startsWith('image/');
  } catch (err) {
    return false;
  }
}
