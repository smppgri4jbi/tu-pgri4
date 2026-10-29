/**
 * Web Crypto API utilities for End-to-End Encryption (E2EE),
 * Document SHA-256 integrity verification, and QR hash generation.
 */

export async function computeSHA256(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback simple hash for older environments
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0') + 'e2eefallback';
  }
}

export function generateVerificationCode(prefix = 'ESURAT'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${randomStr}`;
}

export async function encryptE2EEPayload(
  payload: Record<string, unknown>,
  secretKeyString: string
): Promise<{ cipherText: string; iv: string; keyFingerprint: string }> {
  const encoder = new TextEncoder();
  const rawData = encoder.encode(JSON.stringify(payload));

  // Derive key via SHA-256
  const keyHash = await crypto.subtle.digest('SHA-256', encoder.encode(secretKeyString));
  const key = await crypto.subtle.importKey(
    'raw',
    keyHash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    rawData
  );

  const cipherText = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
  const ivBase64 = btoa(String.fromCharCode(...iv));
  const keyFingerprint = Array.from(new Uint8Array(keyHash).slice(0, 8))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return { cipherText, iv: ivBase64, keyFingerprint: `KEY-${keyFingerprint.toUpperCase()}` };
}

export async function decryptE2EEPayload(
  cipherText: string,
  ivBase64: string,
  secretKeyString: string
): Promise<Record<string, unknown>> {
  const encoder = new TextEncoder();
  const keyHash = await crypto.subtle.digest('SHA-256', encoder.encode(secretKeyString));
  const key = await crypto.subtle.importKey(
    'raw',
    keyHash,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const encryptedBuffer = Uint8Array.from(atob(cipherText), c => c.charCodeAt(0));

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decryptedBuffer));
}

// Synthetic chime using Web Audio API for push notifications
export function playNotificationSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.28); // D6

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.1);
    osc1.stop(ctx.currentTime + 0.45);
    osc2.stop(ctx.currentTime + 0.45);
  } catch {
    // Ignore audio autoplay restrictions
  }
}
