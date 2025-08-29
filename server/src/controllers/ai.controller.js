// AI controller stub
export async function summarize(req, res) {
  res.json({ summary: ['Summary bullet 1', 'Summary bullet 2'] });
}

export async function verify(req, res) {
  res.json({ credibilityScore: 80, redFlags: [], summary: 'Looks good.' });
}
