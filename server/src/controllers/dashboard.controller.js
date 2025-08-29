// Dashboard controller stub
export async function metrics(req, res) {
  res.json({ users: 3, ngos: 5, events: 10, participants: 20 });
}

export async function leaderboard(req, res) {
  res.json([]);
}
