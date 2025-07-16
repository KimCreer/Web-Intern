export async function generateGeminiInsights(prompt) {
  const response = await fetch('/api/gemini/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Gemini insights');
  }

  const data = await response.json();
  return data.text || 'No insights generated.';
} 