// Minimal GitHub Contents API client for the dashboard.
//
// Publishing is a commit: the dashboard writes lib/overrides.json (and any
// uploaded images under public/uploads) to the repo, and the existing Pages
// workflow rebuilds the site. The token never leaves the browser that typed it:
// it is kept in that browser's localStorage and sent only to api.github.com.

export type GhConfig = { repo: string; branch: string; token: string };

const KEY = "mt_gh";
export const DEFAULT_REPO = "Mohamed-sr-Designer/mohamed-tarek-portfolio-v2";

export function loadGh(): GhConfig {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { repo: DEFAULT_REPO, branch: "main", token: "", ...JSON.parse(raw) };
  } catch {}
  return { repo: DEFAULT_REPO, branch: "main", token: "" };
}

export function saveGh(c: GhConfig) {
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {}
}

async function gh(c: GhConfig, path: string, init?: RequestInit) {
  const r = await fetch(`https://api.github.com/repos/${c.repo}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${c.token}`,
      Accept: "application/vnd.github+json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${r.status} ${(body as { message?: string }).message ?? r.statusText}`);
  return body;
}

export async function checkAccess(c: GhConfig): Promise<string> {
  const repo = await gh(c, "");
  const canPush = (repo as { permissions?: { push?: boolean } }).permissions?.push;
  if (!canPush) throw new Error("This token cannot write to the repository.");
  return (repo as { full_name: string }).full_name;
}

async function shaOf(c: GhConfig, file: string): Promise<string | undefined> {
  try {
    const r = await gh(c, `/contents/${encodeURI(file)}?ref=${c.branch}`);
    return (r as { sha?: string }).sha;
  } catch {
    return undefined;
  }
}

const b64FromText = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
};

export async function putFile(
  c: GhConfig,
  file: string,
  contentB64: string,
  message: string
) {
  const sha = await shaOf(c, file);
  return gh(c, `/contents/${encodeURI(file)}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: contentB64, branch: c.branch, sha }),
  });
}

export const putText = (c: GhConfig, file: string, text: string, message: string) =>
  putFile(c, file, b64FromText(text), message);

export async function latestRun(c: GhConfig) {
  const r = (await gh(c, `/actions/runs?per_page=1&branch=${c.branch}`)) as {
    workflow_runs?: { status: string; conclusion: string | null; html_url: string; created_at: string }[];
  };
  return r.workflow_runs?.[0];
}
