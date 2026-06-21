const FIREBASE_DB_URL = "https://mealmind-def29-default-rtdb.firebaseio.com";

async function request(path, options = {}) {
  const url = `${FIREBASE_DB_URL}${path}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Firebase request failed: ${response.statusText}`);
  }
  return response.json();
}

export async function findUserByEmail(email) {
  const data = await request("/users.json");
  if (!data) {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  return Object.entries(data)
    .map(([id, user]) => ({ id, ...user }))
    .find((user) => user.email?.toLowerCase() === normalizedEmail) || null;
}

export async function createUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("Email is already registered.");
  }

  const payload = {
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  const result = await request("/users.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return {
    id: result.name,
    email: normalizedEmail,
  };
}
