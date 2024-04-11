export default function TeamEdit({ params }: { params: { teamId: string } }) {
	const { teamId } = params

	return (
		<main className="my-5 flex-1">
			<h1 className="mb-5 text-center text-3xl font-bold">Modifier l'équipe {teamId}</h1>
			<p className="text-center">Pas implémenté en front</p>
		</main>
	)
}