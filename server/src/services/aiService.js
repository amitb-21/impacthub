// AI service stub for verification and summarization
export function mockVerify(ngo) {
  return {
    credibilityScore: 80,
    redFlags: ['Missing website'],
    summary: 'NGO appears credible based on provided docs.'
  };
}

export function mockSummarize(text) {
  return ['Summary bullet 1', 'Summary bullet 2', 'Summary bullet 3'];
}
