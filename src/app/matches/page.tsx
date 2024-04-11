import MatchsList from "@/components/lists/matchs-list"

export default function MatchPage() {
	return (
		<main className="my-5 flex-1">
			<h1 className="mb-5 text-center text-3xl font-bold">Liste des matchs</h1>
			<MatchsList />
		</main>
	)
}