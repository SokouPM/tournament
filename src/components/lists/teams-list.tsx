"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { IoInformationCircleOutline } from "react-icons/io5"
import { MdDelete, MdErrorOutline } from "react-icons/md"
import Swal from "sweetalert2"

interface Team {
	id: number
	name: string
	createdAt: Date
	updatedAt: Date | null
}

export default function TeamsList() {
	const [teams, setTeams] = useState<Team[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const deleteTeam = async (id: number):Promise<void> => {
		try {
			setLoading(true)

			const response = await fetch(`/api/teams/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			})
			const data = await response.json()

			if (!response.ok) {
				setError(data.message)

				return
			}

			fetchTeams().then()
		} finally {
			setLoading(false)
		}
	}

	const fetchTeams = async ():Promise<void> => {
		try {
			setLoading(true)

			const response = await fetch("/api/teams", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
			const data = await response.json()

			if (!response.ok) {
				setError(data.message)

				return
			}

			setTeams(data)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchTeams().then()
	}, [])

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<span className="loading loading-dots loading-lg text-secondary"></span>
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

	if (!teams.length) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div role="alert" className="alert alert-info w-8/12">
					<IoInformationCircleOutline className="text-3xl" />
					<span>Pas encore d'équipe enregistrée</span>
				</div>
			</div>
		)
	}

	return (
		<div className="mx-auto w-10/12 overflow-x-auto">
			<table className="table table-zebra">
				<thead>
					<tr>
						<th>#</th>
						<th>Nom</th>
						<th>Date de création</th>
						<th>Date de modification</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{teams.map((team) => (
						<tr key={team.id}>
							<td>{team.id}</td>
							<td>{team.name}</td>
							<td>
								Le {new Date(team.createdAt).toLocaleDateString()} à {new Date(team.createdAt).toLocaleTimeString()}
							</td>
							{team.updatedAt ? (
								<td>
									Le {new Date(team.updatedAt).toLocaleDateString()} à {new Date(team.updatedAt).toLocaleTimeString()}
								</td>
							) : (
								<td></td>
							)}
							<td className="flex items-center justify-evenly">
								<Link href={`/teams/${team.id}/edit`} className="btn btn-square btn-primary text-base-100">
									<FaEdit className="text-xl" />
								</Link>
								<button
									className="btn btn-square btn-error text-base-100"
									onClick={() => {
										Swal.fire({
											title: `Êtes-vous sûr de vouloir supprimer l'équipe "${team.name}" ?`,
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
												deleteTeam(team.id).then()
											}
										})
									}}>

									<MdDelete className="text-xl" />
								</button>
								<Link className="btn btn-outline" href={`/teams/${team.id}`}>
									Statistiques
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}