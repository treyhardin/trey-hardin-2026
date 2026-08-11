export async function GET() {
	return new Response(
		JSON.stringify({
			apiVersion: '2025-01-01',
			useCdn: false,
			token: import.meta.env.SANITY_API_READ_TOKEN || '',
			projectId: 'vs8d5hbw',
			dataset: 'production',
		}),
		{
			headers: {
				'content-type': 'application/json',
			},
		},
	);
}
