import TeamStats from "@/components/team-stats"

export default function TeamPage({ params }: { params: { teamId: string } }) {
	return (
		<main className="my-5 flex-1">
			<h1 className="mb-5 text-center text-3xl font-bold">Statistiques de l'équipe</h1>
			<TeamStats params={params} />
		</main>
	)
}