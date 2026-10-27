/**
 * Resilient Client-Side Media Upload Utility
 * Handles authentication, automatic failover across endpoints, and XMLHttpRequest fallback
 * to guarantee that media uploads never fail due to transient network drops or socket aborts.
 */
export async function uploadClientMedia(
  file: File,
  folder: string = "green-garden"
): Promise<{ url: string; provider?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("gg_auth_token") : null;
  const authHeaders: Record<string, string> = {};
  if (storedToken && storedToken !== "null" && storedToken !== "undefined") {
    authHeaders["Authorization"] = `Bearer ${storedToken}`;
  }

  // 1. First attempt: /api/upload/admin via fetch
  try {
    const res = await fetch(`/api/upload/admin?_t=${Date.now()}`, {
      method: "POST",
      headers: authHeaders,
      credentials: "include",
      body: formData,
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.url) {
      return { url: data.url, provider: data.provider };
    }
  } catch (err) {
    console.warn("fetch /api/upload/admin error, attempting fallback:", err);
  }

  // 2. Second attempt: /api/upload via fetch
  try {
    const res = await fetch(`/api/upload?_t=${Date.now()}`, {
      method: "POST",
      headers: authHeaders,
      credentials: "include",
      body: formData,
    });

    const data = await res.json().catch(() => null);
    if (res.ok && data?.url) {
      return { url: data.url, provider: data.provider };
    }
  } catch (err) {
    console.warn("fetch /api/upload error, attempting XHR fallback:", err);
  }

  // 3. Third attempt: /api/upload/admin via XMLHttpRequest
  try {
    const xhrResult = await new Promise<{ url: string; provider?: string }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/upload/admin?_t=${Date.now()}`);
      xhr.withCredentials = true;
      if (authHeaders["Authorization"]) {
        xhr.setRequestHeader("Authorization", authHeaders["Authorization"]);
      }
      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300 && data.url) {
            resolve({ url: data.url, provider: data.provider });
          } else {
            reject(new Error(data.error || `HTTP ${xhr.status}`));
          }
        } catch {
          reject(new Error(`HTTP ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error("XHR admin error"));
      xhr.send(formData);
    });
    return xhrResult;
  } catch (xhrAdminErr) {
    console.warn("XHR admin error, attempting final public XHR:", xhrAdminErr);
  }

  // 4. Fourth attempt: /api/upload via XMLHttpRequest (immune to fetch stream/connection aborts)
  return new Promise<{ url: string; provider?: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/upload?_t=${Date.now()}`);
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          resolve({ url: data.url, provider: data.provider });
        } else {
          reject(new Error(data.error || `ফাইল আপলোড ব্যর্থ হয়েছে (HTTP ${xhr.status})`));
        }
      } catch {
        reject(new Error(`ফাইল আপলোড ব্যর্থ হয়েছে (HTTP ${xhr.status})`));
      }
    };
    xhr.onerror = () =>
      reject(new Error("ফাইল আপলোড ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ এবং ফাইলের আকার পরীক্ষা করুন।"));
    xhr.send(formData);
  });
}
