const DEFAULT_PAIRING_CODE_TTL_MS = 180000;
const DEFAULT_PAIRING_BLOCK_MS = 300000;
const DEFAULT_PAIRING_MAX_BLOCK_MS = 3600000;

export const PAIRING_CODE_TTL_MS = readPositiveIntEnv(
  'WHATSAPP_PAIRING_CODE_TTL_MS',
  DEFAULT_PAIRING_CODE_TTL_MS
);

const PAIRING_BLOCK_MS = readPositiveIntEnv(
  'WHATSAPP_PAIRING_BLOCK_MS',
  DEFAULT_PAIRING_BLOCK_MS
);

const PAIRING_MAX_BLOCK_MS = Math.max(
  PAIRING_BLOCK_MS,
  readPositiveIntEnv('WHATSAPP_PAIRING_MAX_BLOCK_MS', DEFAULT_PAIRING_MAX_BLOCK_MS)
);

function readPositiveIntEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getErrorText(error) {
  return String(error?.message || error || 'Unknown pairing error').trim();
}

export function getPairingErrorDetails(error) {
  const message = getErrorText(error);
  const name = error?.name ? String(error.name) : '';
  const code = error?.code ? String(error.code) : '';
  const combined = [name, code, message].filter(Boolean).join(': ').slice(0, 500);

  return {
    name,
    code,
    message,
    combined: combined || 'Unknown pairing error'
  };
}

export function createPairingBlock(previousFailureCount, error) {
  const failureCount = Math.max(0, Number(previousFailureCount) || 0) + 1;
  const failedAt = Date.now();
  const backoffMultiplier = 2 ** Math.min(failureCount - 1, 5);
  const blockDurationMs = Math.min(PAIRING_MAX_BLOCK_MS, PAIRING_BLOCK_MS * backoffMultiplier);
  const details = getPairingErrorDetails(error);

  return {
    failureCount,
    failedAt,
    blockedUntil: failedAt + blockDurationMs,
    lastError: details.combined
  };
}

export function getPairingRetryAfterSeconds(blockedUntil, now = Date.now()) {
  const retryAfterMs = Math.max(0, Number(blockedUntil || 0) - now);
  return retryAfterMs > 0 ? Math.ceil(retryAfterMs / 1000) : 0;
}

export function isPairingBlocked(blockedUntil, now = Date.now()) {
  return getPairingRetryAfterSeconds(blockedUntil, now) > 0;
}

export function isPairingCodeFresh(issuedAt, now = Date.now()) {
  const issued = Number(issuedAt) || 0;
  return issued > 0 && now - issued < PAIRING_CODE_TTL_MS;
}

export function createSafePairingRequest(requestPairingCode, onFailure) {
  let pendingRequest = null;

  return async function safeRequestPairingCode(...args) {
    if (pendingRequest) {
      return pendingRequest;
    }

    pendingRequest = Promise.resolve()
      .then(() => requestPairingCode(...args))
      .catch((error) => {
        try {
          onFailure?.(error);
        } catch (handlerError) {
          console.warn('[WhatsApp Pairing] Pairing failure handler failed:', getErrorText(handlerError));
        }
        throw error;
      })
      .finally(() => {
        pendingRequest = null;
      });

    return pendingRequest;
  };
}
