// Lightweight client-side admin gate. Swap for Lovable Cloud auth later.
const KEY = "taphub.admin";
const PASSWORD = "shalom"; // placeholder; real auth replaces this

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function signIn(password: string): boolean {
  if (password.trim().toLowerCase() === PASSWORD) {
    window.localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
}

export function signOut() {
  window.localStorage.removeItem(KEY);
}
