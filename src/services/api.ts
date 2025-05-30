import type {
  LoginCredentials,
  RegisterCredentials
} from '../types/Credentials';
import type { User } from '../types/User';
import type { Work } from '../types/Work';
import type { Webhook } from '../types/Webhook';
import type { Profile } from '../types/Profile';

const API_BASE = import.meta.env.VITE_API_BASE!;

const getAuthToken = () => localStorage.getItem('token');

let globalLogout: ((silent: boolean, message?: string) => void) | undefined;
export const setGlobalLogout = (
  logoutFn: (silent: boolean, message?: string) => void
) => {
  globalLogout = logoutFn;
};

const fetchWrapper = async (
  endpoint: string,
  options: RequestInit = {},
  auth: boolean = false
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  interface ApiError {
    error: string;
    statusCode?: number;
    details?: string;
  }

  if (auth) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json().catch(() => ({
      error: `Request to ${endpoint} failed with status ${res.status}`
    }));
    errorData.statusCode = res.status;
    const message = errorData.error || `Request to ${endpoint} failed`;

    if (
      [401, 403].includes(res.status) &&
      errorData.error?.toLowerCase().includes('token')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      globalLogout?.(true, message);
      throw new Error(JSON.stringify(errorData));
    }

    throw new Error(JSON.stringify(errorData));
  }

  return res.json();
};

// ─── Auth ────────────────────────────────────────────

export const login = (data: LoginCredentials) =>
  fetchWrapper('/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const register = (data: RegisterCredentials) =>
  fetchWrapper('/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const logout = () => fetchWrapper('/logout', { method: 'POST' }, true);

// ─── Users ───────────────────────────────────────────

export const getUsers = () => fetchWrapper('/users', {}, true);

export const updateUser = (id: User['id'], updates: Partial<User>) =>
  fetchWrapper(
    `/users/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates)
    },
    true
  );

export const deleteUser = (id: User['id']) =>
  fetchWrapper(
    `/users/${id}`,
    {
      method: 'DELETE'
    },
    true
  );

// ─── Works ───────────────────────────────────────────

export const getWorks = async (): Promise<Work[]> => {
  const raw = await fetchWrapper('/works');
  return Object.keys(raw).map(key => ({
    ...raw[key],
    id: raw[key].id || parseInt(key)
  }));
};

export const addWork = (newWork: Partial<Work>) =>
  fetchWrapper(
    '/works',
    {
      method: 'POST',
      body: JSON.stringify(newWork)
    },
    true
  );

export const updateWork = (id: Work['id'], updates: Partial<Work>) =>
  fetchWrapper(
    `/works/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates)
    },
    true
  );

export const updateWorkStatus = (id: Work['id'], status: Work['status']) =>
  fetchWrapper(
    `/works/${id}/status`,
    {
      method: 'PUT',
      body: JSON.stringify({ status })
    },
    true
  );

export const approveWork = (id: Work['id']) =>
  fetchWrapper(
    `/works/${id}/approve`,
    {
      method: 'PUT'
    },
    true
  );

export const deleteWork = (id: Work['id']) =>
  fetchWrapper(
    `/works/${id}`,
    {
      method: 'DELETE'
    },
    true
  );

// ─── Profiles ────────────────────────────────────────
export const getProfiles = async (): Promise<Profile[]> => {
  const raw = await fetchWrapper('/profiles');
  return Object.keys(raw).map(key => ({
    ...raw[key],
    id: raw[key].id || parseInt(key)
  }));
};

export const addProfile = (newProfile: Partial<Profile>) =>
  fetchWrapper(
    '/profiles',
    {
      method: 'POST',
      body: JSON.stringify(newProfile)
    },
    true
  );

export const updateProfile = (id: Profile['id'], updates: Partial<Profile>) =>
  fetchWrapper(
    `/profiles/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates)
    },
    true
  );

export const updateProfileStatus = (
  id: Profile['id'],
  status: Profile['status']
) =>
  fetchWrapper(
    `/profiles/${id}/status`,
    {
      method: 'PUT',
      body: JSON.stringify({ status })
    },
    true
  );

export const approveProfile = (id: Profile['id']) =>
  fetchWrapper(
    `/profiles/${id}/approve`,
    {
      method: 'PUT'
    },
    true
  );

export const deleteProfile = (id: Profile['id']) =>
  fetchWrapper(
    `/profiles/${id}`,
    {
      method: 'DELETE'
    },
    true
  );

// ─── Webhooks ──────────────────────────────────────────
export const getWebhooks = (): Promise<Webhook[]> =>
  fetchWrapper('/webhooks', {}, true);

export const addWebhook = (data: { url: string; name: string }) =>
  fetchWrapper(
    '/webhooks',
    {
      method: 'POST',
      body: JSON.stringify(data)
    },
    true
  );

export const deleteWebhook = (id: string) =>
  fetchWrapper(
    `/webhooks/${id}`,
    {
      method: 'DELETE'
    },
    true
  );
