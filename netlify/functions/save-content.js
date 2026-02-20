// ── TumeloGaming: Save Content to GitHub ─────────────────────────

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };

  // Verify Netlify Identity JWT — Netlify auto-populates this when Identity is enabled
  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return {
      statusCode: 401, headers: corsHeaders,
      body: JSON.stringify({ error: 'Unauthorized. Log in via Netlify Identity first.' })
    };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO  = process.env.GITHUB_REPO; // e.g. "tumelogaming/my-site"

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return {
      statusCode: 500, headers: corsHeaders,
      body: JSON.stringify({
        error: 'Missing env vars.',
        hint: 'Add GITHUB_TOKEN and GITHUB_REPO in Netlify → Site config → Environment variables.',
        missing: [!GITHUB_TOKEN && 'GITHUB_TOKEN', !GITHUB_REPO && 'GITHUB_REPO'].filter(Boolean)
      })
    };
  }

  let newContent;
  try { newContent = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON body' }) }; }

  if (!newContent.hero || !newContent.positions || !newContent.servers) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid content schema' }) };
  }

  const BRANCH   = 'main';
  const API_URL  = `https://api.github.com/repos/${GITHUB_REPO}/contents/content.json`;
  const ghHeaders = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'TumeloGaming-Admin/1.0',
  };

  // Step 1: Get current file SHA from GitHub
  let currentSha;
  try {
    const getRes = await fetch(`${API_URL}?ref=${BRANCH}`, { headers: ghHeaders });
    if (getRes.status === 404) {
      return {
        statusCode: 500, headers: corsHeaders,
        body: JSON.stringify({
          error: `content.json not found in repo "${GITHUB_REPO}" on branch "${BRANCH}".`,
          hint: 'Make sure you pushed your files to GitHub and connected the repo to Netlify.'
        })
      };
    }
    if (!getRes.ok) throw new Error(`GitHub GET ${getRes.status}: ${await getRes.text()}`);
    currentSha = (await getRes.json()).sha;
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: `Read failed: ${err.message}`, hint: 'Check GITHUB_TOKEN and GITHUB_REPO are correct.' }) };
  }

  // Step 2: Write updated content.json
  const encoded = Buffer.from(JSON.stringify(newContent, null, 2), 'utf-8').toString('base64');
  try {
    const putRes = await fetch(API_URL, {
      method: 'PUT', headers: ghHeaders,
      body: JSON.stringify({
        message: `✏️ Admin update — ${new Date().toUTCString()} by ${user.email}`,
        content: encoded,
        sha: currentSha,
        branch: BRANCH,
      })
    });
    if (!putRes.ok) throw new Error(`GitHub PUT ${putRes.status}: ${await putRes.text()}`);
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: `Save failed: ${err.message}`, hint: 'Check GITHUB_TOKEN has "repo" scope.' }) };
  }

  return {
    statusCode: 200, headers: corsHeaders,
    body: JSON.stringify({ success: true, message: 'Saved! Site rebuilds in ~30 seconds.', savedBy: user.email })
  };
};
