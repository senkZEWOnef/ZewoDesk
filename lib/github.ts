// lib/github.ts
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  default_branch: string;
  updated_at: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

export async function getRepoInfo(repoFullName: string, token?: string): Promise<GitHubRepo | null> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'dev-console'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch repo info:', error);
    return null;
  }
}

export async function getLatestCommit(repoFullName: string, token?: string): Promise<GitHubCommit | null> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'dev-console'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/repos/${repoFullName}/commits?per_page=1`, {
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();
    return commits[0] || null;
  } catch (error) {
    console.error('Failed to fetch latest commit:', error);
    return null;
  }
}

export async function getReadme(repoFullName: string, token?: string): Promise<string | null> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3.raw',
      'User-Agent': 'dev-console'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/repos/${repoFullName}/readme`, {
      headers,
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Failed to fetch README:', error);
    return null;
  }
}