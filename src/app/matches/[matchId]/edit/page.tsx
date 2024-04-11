export default function MatchEdit({ params }: { params: { matchId: string } }) {
	const { matchId } = params

	return (
		<main className="my-5 flex-1">
			<h1 className="mb-5 text-center text-3xl font-bold">Modifier le match {matchId}</h1>
			<p className="text-center">Pas implémenté en front</p>
		</main>
	)
}