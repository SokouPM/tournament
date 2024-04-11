"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { IoInformationCircleOutline } from "react-icons/io5"
import { MdCheckCircleOutline, MdErrorOutline } from "react-icons/md"
import { z } from "zod"

interface Team {
	id: number
	name: string
	createdAt: Date
	updatedAt: Date
}

type Inputs = {
	homeTeam: number
	awayTeam: number
	winner: number
	homeScore: number
	awayScore: number
	date: Date
}

const schema = z
	.object({
		homeTeam: z.coerce.number().int().nonnegative("Vous devez choisir une équipe à domicile"),
		awayTeam: z.coerce.number().int().nonnegative("Vous devez choisir une équipe à l'extérieur"),
		winner: z.coerce.number().int().nonnegative("Vous devez choisir un gagnant"),
		homeScore: z.coerce.number().int().nonnegative("Le score à domicile doit être un nombre positif"),
		awayScore: z.coerce.number().int().nonnegative("Le score à l'extérieur doit être un nombre positif"),
		date: z.coerce.date({
			required_error: "Vous devez choisir une date",
			invalid_type_error: "La date est invalide",
		})
	})
	.refine(
		(values) => {
			if (values.homeTeam && values.awayTeam) {
				if (values.homeTeam === values.awayTeam) {
					return false
				}
			}

			return true
		},
		{
			message: "L'équipe à domicile ne peut pas être la même que l'équipe à l'extérieur",
			path: ["awayTeam"],
		},
	).refine(
(values) => {
			switch (true) {
				case values.homeScore > values.awayScore:
					return values.winner === values.homeTeam

				case values.homeScore < values.awayScore:
					return values.winner === values.awayTeam

				default:
					return values.winner === 0
			}
		},
		{
			message: "Le gagnant doit être une des deux équipes et doit correspondre au score le plus élevé",
			path: ["winner"],
		},
	)

export default function MatchForm() {
	const router = useRouter()

	const [teams, setTeams] = useState<Team[]>([])
	const [teamsError, setTeamsError] = useState<string | null>(null)
	const [teamsLoading, setTeamsLoading] = useState<boolean>(true)

	const [apiError, setApiError] = useState<string | null>(null)
	const [apiResponse, setApiResponse] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		resolver: zodResolver(schema),
		defaultValues: {
			homeTeam: 0,
			awayTeam: 0,
			winner: 0,
			homeScore: 0,
			awayScore: 0,
			date: undefined,
		},
	})

	const fetchTeams = async ():Promise<void> => {
		try {
			setTeamsLoading(true)

			const response = await fetch("/api/teams", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
			const data = await response.json()

			if (!response.ok) {
				setTeamsError(data.message)

				return
			}

			setTeams(data)
		} finally {
			setTeamsLoading(false)
		}
	}

	useEffect(() => {
		fetchTeams().then()
	}, [])

	const postMatch = async (
		homeTeam: number | null,
		awayTeam: number | null,
		winner: number | null,
		homeScore: number,
		awayScore: number,
		date: Date
	): Promise<any> => {
		try {
			setLoading(true)

			if (homeTeam === 0) {
				homeTeam = null
			}

			if (awayTeam === 0) {
				awayTeam = null
			}

			if (winner === 0) {
				winner = null
			}

			const response = await fetch("/api/matches", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ homeTeam, awayTeam, winner, homeScore, awayScore, date }),
			})
			const data = await response.json()

			if (!response.ok) {
				setApiError(data.message)

				return
			}

			setApiResponse(data.message)
			setTimeout(() => router.push("/matches"), 5000)
		} finally {
			setLoading(false)
		}
	}

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		const {
			homeTeam,
			awayTeam,
			winner,
			homeScore,
			awayScore,
			date
		} = data

		postMatch(
			homeTeam,
			awayTeam,
			winner,
			homeScore,
			awayScore,
			date
		).then()
	}

	if (teamsLoading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<span className="loading loading-dots loading-lg text-secondary"></span>
			</div>
		)
	}

	if (teamsError) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div role="alert" className="alert alert-error w-8/12">
					<MdErrorOutline className="text-3xl" />
					<span>Erreur : {teamsError}</span>
				</div>
			</div>
		)
	}

	if (teams.length < 2) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<div role="alert" className="alert alert-info w-8/12">
					<IoInformationCircleOutline className="text-3xl" />
					<span>Vous devez créer des équipes avant de pouvoir créer un match</span>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full">
			{loading ? (
				<div className="mb-5 flex flex-1 items-center justify-center">
					<span className="loading loading-dots loading-lg text-secondary"></span>
				</div>
			) : apiError ? (
				<div role="alert" className="alert alert-error mx-auto mb-5 w-8/12">
					<MdErrorOutline className="text-3xl" />
					<span>Erreur : {apiError}</span>
				</div>
			) : (
				apiResponse && (
					<div role="alert" className="alert alert-success mx-auto mb-5 w-8/12">
						<MdCheckCircleOutline className="text-3xl" />
						<span>Succès : {apiResponse}, vous allez être redirigé vers la liste des matchs</span>
					</div>
				)
			)}

			<form className="mx-auto w-8/12 rounded p-5 shadow-xl" onSubmit={handleSubmit(onSubmit)}>
				<div className="flex items-center justify-between">
					<label htmlFor="homeTeam" className="mr-1 w-1/2">
						<div className="label">
							<span className="label-text text-xl font-bold">Équipe à domicile</span>
						</div>
						<select
							id="homeTeam"
							className={`select select-bordered w-full ${errors.homeTeam && "input-error text-error"}`}
							{...register("homeTeam")}
						>
							<option value={0}>Aucune équipe</option>
							{teams.map((team) => (
								<option key={team.id} value={team.id}>{team.name}</option>
							))}
						</select>
						<div className="label">
							{errors.homeTeam && <span className="label-text-alt text-error">{errors.homeTeam.message}</span>}
						</div>
					</label>
					<label htmlFor="awayTeam" className="ml-1 w-1/2">
						<div className="label">
							<span className="label-text text-xl font-bold">Nom de l'équipe éxtérieure</span>
						</div>
						<select
							id="awayTeam"
							className={`select select-bordered w-full ${errors.awayTeam && "input-error text-error"}`}
							{...register("awayTeam")}
						>
							<option value={0}>Aucune équipe</option>
							{teams.map((team) => (
								<option key={team.id} value={team.id}>{team.name}</option>
							))}
						</select>
						<div className="label">
							{errors.awayTeam && <span className="label-text-alt text-error">{errors.awayTeam.message}</span>}
						</div>
					</label>
				</div>

				<div className="flex items-center justify-between">
					<label htmlFor="homeScore" className="mr-1 w-1/2">
						<div className="label">
							<span className="label-text text-xl font-bold">Score à domicile</span>
						</div>
						<input
							type="number"
							id="homeScore"
							min={0}
							className={`input input-bordered w-full ${errors.homeScore && "input-error text-error"}`}
							{...register("homeScore")}
						/>
						<div className="label">
							{errors.homeScore && <span className="label-text-alt text-error">{errors.homeScore.message}</span>}
						</div>
					</label>
					<label htmlFor="awayScore" className="ml-1 w-1/2">
						<div className="label">
							<span className="label-text text-xl font-bold">Score à l'extérieur</span>
						</div>
						<input
							type="number"
							id="awayScore"
							min={0}
							className={`input input-bordered w-full ${errors.awayScore && "input-error text-error"}`}
							{...register("awayScore")}
						/>
						<div className="label">
							{errors.awayScore && <span className="label-text-alt text-error">{errors.awayScore.message}</span>}
						</div>
					</label>
				</div>

				<div className="flex items-center justify-between">
					<label htmlFor="winner" className="mr-1 w-1/2">
						<div className="label">
							<span className="label-text text-xl font-bold">Gagnant</span>
						</div>
						<select
							id="winner"
							className={`select select-bordered w-full ${errors.winner && "input-error text-error"}`}
							{...register("winner")}
						>
							<option value={0}>Aucune équipe</option>
							{teams.map((team) => (
								<option key={team.id} value={team.id}>{team.name}</option>
							))}
						</select>
						<div className="label">
							{errors.winner && <span className="label-text-alt text-error">{errors.winner.message}</span>}
						</div>
					</label>
					<label htmlFor="date" className="ml-1 w-1/2">
						<div className="label">
							<span className="label-text text-xl font-bold">Date</span>
						</div>
						<input
							type="datetime-local"
							id="date"
							className={`input input-bordered w-full ${errors.date && "input-error text-error"}`}
							{...register("date")}
						/>
						<div className="label">
							{errors.date && <span className="label-text-alt text-error">{errors.date.message}</span>}
						</div>
					</label>
				</div>
				<input type="submit" value="Ajouter" className="btn btn-accent" />
			</form>

		</div>
	)
}