import Link from "next/link"

export default function NotFound() {
	return (
		<main className="flex flex-1 items-center justify-center">
			<div className="text-center">
				<h1 className="text-3xl font-bold">404 - Page non trouvée</h1>
				<p className="mb-5">La page que vous cherchez n'existe pas.</p>
				<Link className="link link-primary" href="/">
					Retour à l'accueil
				</Link>
			</div>
		</main>
	)
}