"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { IoInformationCircleOutline } from "react-icons/io5"
import { MdDelete, MdErrorOutline } from "react-icons/md"
import Swal from "sweetalert2"

interface Match {
	id: number
	homeTeamId: number | null
	awayTeamId: number | null
	winnerId: number | null
	homeTeamScore: number | null
	awayTeamScore: number | null
	matchDate: Date
	createdAt: Date
	updatedAt: Date | null
	homeTeam?: {
		id: number
		name: string
		createAt: Date
		updatedAt: Date | null
	}
	awayTeam?: {
		id: number
		name: string
		createAt: Date
		updatedAt: Date | null
	}
	winner?: {
		id: number
		name: string
		createAt: Date
		updatedAt: Date | null
	}
}

export default function TeamsList() {
	const [matches, setMatches] = useState<Match[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	async function deleteMatch(id: number) {
		try {
			setLoading(true)

			const response = await fetch(`/api/matches/${id}`, {method: "DELETE"})
			const data = await response.json()

			if (!response.ok) {
				setError(data.message)

				return
			}

			fetchMatches().then()
		} finally {
			setLoading(false)
		}
	}

	async function fetchMatches() {
		setLoading(true)
		
		try {
			const response = await fetch("/api/matches", {method: "GET"})

			return await response.json()
		} catch (error: any) {
			setError(error.message)

			return
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchMatches().then((response) => {
			setMatches(response)
		})
	}, [])

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<span className="loading loading-dots loading-lg text-secondary"></span>
			</div>
		)
	}

	if (!matches.length) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div role="alert" className="alert alert-info w-8/12">
					<IoInformationCircleOutline className="text-3xl" />
					<span>Pas encore de match enregistré</span>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div role="alert" className="alert alert-error w-8/12">
					<MdErrorOutline className="text-3xl" />
					<span>Erreur : {error}</span>
				</div>
			</div>
		)
	}

	return (
		<div className="mx-auto w-11/12 overflow-x-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th>#</th>
						<th>Equipe à domicile</th>
						<th>Equipe extérieure</th>
						<th>Vainqueur</th>
						<th>Score</th>
						<th>Date du match</th>
						<th>Date de création</th>
						<th>Date de modification</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{matches.map((match) => (
						<tr key={match.id}>
							<td>{match.id}</td>
							<td>{match.homeTeam?.name}</td>
							<td>{match.awayTeam?.name}</td>
							<td>{match.winner?.name}</td>
							<td>
								{match.homeTeamScore} - {match.awayTeamScore}
							</td>
							<td>
								Le {new Date(match.matchDate).toLocaleDateString()} à {new Date(match.matchDate).toLocaleTimeString()}
							</td>
							<td>
								Le {new Date(match.createdAt).toLocaleDateString()} à {new Date(match.createdAt).toLocaleTimeString()}
							</td>
							{match.updatedAt ? (
								<td>
									Le {new Date(match.updatedAt).toLocaleDateString()} à {new Date(match.updatedAt).toLocaleTimeString()}
								</td>
							) : (
								<td></td>
							)}
							<td className="flex items-center justify-evenly">
								<Link href={`/matches/${match.id}/edit`} className="btn btn-square btn-primary text-base-100">
									<FaEdit className="text-xl" />
								</Link>
								<button
									className="btn btn-square btn-error text-base-100"
									onClick={() => {
										Swal.fire({
											title: `Êtes-vous sûr de vouloir supprimer le match "${match.id}" ?`,
											text: "Cette action est irréversible",
											icon: "warning",
											showCancelButton: true,
											confirmButtonText: "Oui",
											confirmButtonColor: "#d33",
											cancelButtonText: "Non",
										}).then((result: any) => {
											if (result.isConfirmed) {
												Swal.fire({
													title: "Supprimé !",
													text: "L'équipe a bien été supprimée",
													icon: "success"
												})
												deleteMatch(match.id).then()
											}
										})
									}}
								>
									<MdDelete className="text-xl" />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}