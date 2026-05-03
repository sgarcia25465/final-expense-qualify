exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.META_CAPI_TOKEN;
  const pixelId = '1706022430363404';

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { eventName, eventId, sourceUrl, userAgent } = body;
  const clientIp = event.headers['x-forwarded-for']
    ? event.headers['x-forwarded-for'].split(',')[0].trim()
    : event.headers['client-ip'] || '';

  const payload = {
    test_event_code: 'TEST64305',
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: sourceUrl,
      action_source: 'website',
      client_user_agent: userAgent,
      client_ip_address: clientIp,
    }]
  };

  const apiUrl = `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${token}`;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  console.log('Meta CAPI response:', JSON.stringify(result));

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(result),
  };
};
