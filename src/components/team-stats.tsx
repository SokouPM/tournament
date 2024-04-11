"use client"

import { useEffect, useState } from "react"
import { MdErrorOutline } from "react-icons/md"

interface TeamStats {
	team: {
		id: number
		name: string
		createdAt: string
		updatedAt: string
	}
	stats: {
		victories: number
		defeats: number
	}
}

export default function TeamStatsPage({ params }: { params: { teamId: string } }) {
	const { teamId } = params
	const [teamStats, setTeamStats] = useState<TeamStats | null>(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchTeamStats = async (): Promise<void> => {
		try {
			setLoading(true)

			const response = await fetch(`/api/teams/${teamId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
			const data = await response.json()

			if (!response.ok) {
				setError(data.message)
			}

			setTeamStats(data)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchTeamStats().then()
	}, [teamId])

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

	return (
		<div className="mx-auto w-10/12 overflow-x-auto">
			<table className="table table-zebra mb-10">
				<thead>
					<tr>
						<th>Nom</th>
						<th>Date de création</th>
						<th>Date de modification</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{teamStats?.team.name}</td>
						<td>{teamStats?.team.createdAt}</td>
						<td>{teamStats?.team.updatedAt}</td>
					</tr>
				</tbody>
			</table>
			<div className="flex items-center justify-center text-5xl font-bold">
				<span className="text-success">{teamStats?.stats.victories} victoire(s)</span> <span className="mx-10">|</span> <span className="text-error">{teamStats?.stats.defeats} défaite(s)</span>
			</div>
		</div>
	)
}
