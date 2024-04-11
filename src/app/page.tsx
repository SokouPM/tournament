import Link from "next/link"

export default function Home() {
	return (
		<main className="flex flex-1">
			<div
				className="hero flex-1"
				style={{
					backgroundImage:
						"url(https://upload.wikimedia.org/wikipedia/commons/f/f9/SydneyFootballStadium_Aug2022_Pre-open.jpg)",
				}}
			>
				<div className="hero-overlay bg-neutral/60"></div>
				<div className="hero-content text-center text-white">
					<div className="glass max-w-md rounded-lg p-5">
						<h1 className="mb-5 text-5xl font-bold">Bienvenue</h1>
						<p className="mb-5">
							Ceci est un TP NextJS / Prisma, le but est de créer une application de gestion de tournois d'équipes
						</p>
						<Link className="btn btn-primary" href={"/teams"}>
							Voir la liste des équipes
						</Link>
					</div>
				</div>
			</div>
		</main>
	)
}
