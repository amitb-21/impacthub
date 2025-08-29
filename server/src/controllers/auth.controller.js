// Auth controller (Firebase only)
export async function signup(req, res) {
  // Handled by Firebase client SDK
  res.status(501).json({ message: 'Signup handled by Firebase client.' });
}

export async function login(req, res) {
  // Handled by Firebase client SDK
  res.status(501).json({ message: 'Login handled by Firebase client.' });
}
