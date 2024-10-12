export async function post({ request }) {
	const { content } = await request.json();

	const optimizedPrompt = `Summarize the following text in a concise and informative manner:

${content}

Please provide a summary that:
1. Does not start with phrases like "This text provides" or "This article discusses".
2. Directly presents the main ideas and key points.
3. Is structured in 3-5 short paragraphs.
4. Uses HTML tags for formatting (<p> for paragraphs, <ul> or <ol> for lists if needed, <strong> for emphasis).
5. Maintains a professional and objective tone.`;

	try {
		const response = await fetch(
			"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB0m5BB0yRXAWPySU_pcKBwJwZFKGV-yos",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${import.meta.env.API_KEY}`,
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: optimizedPrompt,
								},
							],
						},
					],
				}),
			},
		);

		const data = await response.json();
		const summary = data.candidates[0].content.parts[0].text;

		return new Response(JSON.stringify({ summary }), { status: 200 });
	} catch (error) {
		console.error("Error fetching summary:", error);
		return new Response(
			JSON.stringify({ error: "Failed to generate summary." }),
			{ status: 500 },
		);
	}
}
