// Step 2 of signing in: GitHub sends the visitor back here, and we hand the login to the editor window.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const saved = (cookie.match(/cms_oauth_state=([^;]+)/) || [])[1];

  if (!code || !state || state !== saved) {
    return reply(url.origin, 'error', { message: 'Sign-in check failed. Please close this window and try again.' });
  }
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'shreelekhabs-cms' },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${url.origin}/api/callback` })
  });
  const data = await res.json().catch(() => ({}));
  if (!data.access_token) {
    return reply(url.origin, 'error', { message: data.error_description || 'GitHub sign-in failed.' });
  }
  return reply(url.origin, 'success', { token: data.access_token, provider: 'github' });
}

function reply(origin, status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html><html><body><p>Signing you in…</p><script>
  (function () {
    var origin = ${JSON.stringify(origin)};
    function receive(e) {
      if (e.origin !== origin) return;
      window.opener.postMessage(${JSON.stringify(message)}, origin);
      window.removeEventListener('message', receive, false);
      setTimeout(function () { window.close(); }, 300);
    }
    window.addEventListener('message', receive, false);
    window.opener.postMessage('authorizing:github', origin);
  })();
  </script></body></html>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': 'cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    }
  });
}
