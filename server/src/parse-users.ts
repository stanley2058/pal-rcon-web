export function getUsers() {
  const results: { username: string; password: string }[] = [];
  const users = (process.env.AUTH_USER || "").split(",");
  const passwords = (process.env.AUTH_PASS || "").split(",");

  for (let i = 0; i < users.length; i++) {
    if (i > passwords.length) break;
    results.push({ username: users[i], password: passwords[i] });
  }
  return results;
}
