const BACKEND = 'https://vanigan-app-automation-5il0.onrender.com';
const BATCH = 60;
const TIMEOUT = 12000;
const CACHE_TTL = 5 * 60 * 1000;

const cache = globalThis.__vaniganPhoneCheckCache || new Map();
globalThis.__vaniganPhoneCheckCache = cache;

export function norm(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

function matchesPhone(business, target) {
  return [
    business.phone,
    business.phone2,
    business.whatsappNo,
    business.whatsappPrimary,
    business.alternatePhone,
    business.landline,
  ]
    .map((value) => norm(value))
    .some((value) => value.length === 10 && value === target);
}

async function fetchJson(url, timeout = TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchPage(page) {
  const data = await fetchJson(`${BACKEND}/api/public/businesses?limit=${BATCH}&page=${page}`);
  return data?.businesses || [];
}

async function fetchBusinessById(id) {
  if (!id) return null;
  const data = await fetchJson(`${BACKEND}/api/public/businesses/${id}`);
  return data?.business || data || null;
}

async function fetchAccountBusiness(phone) {
  const data = await fetchJson(
    `${BACKEND}/api/web-auth/me?phone=${encodeURIComponent(phone)}`,
    5000
  );
  if (data?.business?._id) return data.business;
  if (data?.user?.businessId) return fetchBusinessById(data.user.businessId);
  return null;
}

export async function lookupBusinessByPhone(rawPhone) {
  const phone = norm(rawPhone);
  if (phone.length !== 10) {
    const error = new Error('Provide a valid 10-digit phone number.');
    error.statusCode = 400;
    throw error;
  }

  const cached = cache.get(phone);
  if (cached && Date.now() - cached.at < CACHE_TTL) {
    return { ...cached.value, cached: true };
  }

  const send = (value) => {
    cache.set(phone, { value, at: Date.now() });
    return value;
  };

  const linkedBusiness = await fetchAccountBusiness(phone);
  if (linkedBusiness?._id && matchesPhone(linkedBusiness, phone)) {
    return send({
      exists: true,
      businessId: linkedBusiness._id,
      business: linkedBusiness,
      source: 'web-auth',
    });
  }

  const page1 = await fetchJson(`${BACKEND}/api/public/businesses?limit=${BATCH}&page=1`);
  const total = page1?.total || 0;
  const firstBatch = page1?.businesses || [];
  const firstHit = firstBatch.find((business) => matchesPhone(business, phone));

  if (firstHit) {
    return send({
      exists: true,
      businessId: firstHit._id,
      business: firstHit,
      source: 'public-scan-page-1',
    });
  }

  if (total <= BATCH) {
    return send({ exists: false, source: 'public-scan' });
  }

  const totalPages = Math.ceil(total / BATCH);
  const pageNumbers = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
  const pages = await Promise.all(pageNumbers.map((page) => fetchPage(page)));

  for (const businesses of pages) {
    const hit = businesses.find((business) => matchesPhone(business, phone));
    if (!hit) continue;
    return send({
      exists: true,
      businessId: hit._id,
      business: hit,
      source: 'public-scan',
    });
  }

  return send({ exists: false, source: 'public-scan' });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const result = await lookupBusinessByPhone(req.query?.phone);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[check-phone] error:', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Phone check failed. Please try again.' });
  }
}
