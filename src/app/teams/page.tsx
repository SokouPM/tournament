import TeamsList from "@/components/lists/teams-list"

export default function TeamsPage() {
	return (
		<main className="my-5 flex-1">
			<h1 className="mb-5 text-center text-3xl font-bold">Liste des équipes</h1>
			<TeamsList />
		</main>
	)
}