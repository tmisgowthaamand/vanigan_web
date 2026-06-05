import { lookupBusinessByPhone, norm } from './check-phone.js';

const WEB_BASE = 'https://vanigan-web.vercel.app';

function readBodyPhone(body) {
  if (!body) return '';
  if (typeof body === 'string') {
    const params = new URLSearchParams(body);
    return params.get('phone') || params.get('from') || params.get('From') || '';
  }
  return body.phone || body.from || body.From || body.waId || body.WaId || '';
}

function phoneFromRequest(req) {
  return (
    req.query?.phone ||
    req.query?.from ||
    req.query?.From ||
    req.query?.waId ||
    req.query?.WaId ||
    readBodyPhone(req.body)
  );
}

function businessUrl(id) {
  return `${WEB_BASE}/business/${id}`;
}

function editUrl(id) {
  return `${WEB_BASE}/business/${id}/edit`;
}

function formatFoundReply(business) {
  const id = business._id;
  const lines = [
    'Your business is registered with Vanigan.',
    '',
    `Name: ${business.name || 'Business'}`,
  ];

  if (business.category) lines.push(`Category: ${business.category}`);
  if (business.phone || business.whatsappNo || business.whatsappPrimary) {
    lines.push(`Phone: ${business.phone || business.whatsappNo || business.whatsappPrimary}`);
  }
  if (id) {
    lines.push('', `View: ${businessUrl(id)}`, `Edit: ${editUrl(id)}`);
  }

  return lines.join('\n');
}

function formatNotFoundReply(phone) {
  return [
    `No business was found for this WhatsApp number: ${phone}.`,
    '',
    `Add your business: ${WEB_BASE}/add-business`,
  ].join('\n');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const phone = norm(phoneFromRequest(req));
  if (phone.length !== 10) {
    return res.status(400).json({
      found: false,
      error: 'Provide a valid WhatsApp phone number.',
      reply: 'Please send from a valid WhatsApp mobile number.',
    });
  }

  try {
    const result = await lookupBusinessByPhone(phone);
    const business = result.business || null;

    if (!result.exists || !business?._id) {
      return res.status(200).json({
        found: false,
        phone,
        source: result.source || 'business-phone-lookup',
        reply: formatNotFoundReply(phone),
        addBusinessUrl: `${WEB_BASE}/add-business`,
      });
    }

    return res.status(200).json({
      found: true,
      phone,
      source: result.source || 'business-phone-lookup',
      businessId: business._id,
      business,
      businessUrl: businessUrl(business._id),
      editUrl: editUrl(business._id),
      reply: formatFoundReply(business),
    });
  } catch (error) {
    console.error('[whatsapp-mybusiness] error:', error);
    return res.status(500).json({
      found: false,
      error: 'Could not load your business right now.',
      reply: 'Could not load your business right now. Please try again.',
    });
  }
}
