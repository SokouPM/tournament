import TeamForm from "@/components/forms/team-form"

export default function AddTeamPage() {
	return (
		<main className="my-5 flex-1">
			<h1 className="mb-5 text-center text-3xl font-bold">Ajouter une équipe</h1>
			<TeamForm />
		</main>
	)
}