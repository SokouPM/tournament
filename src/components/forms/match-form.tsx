"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { MdCheckCircleOutline, MdErrorOutline } from "react-icons/md"
import { z } from "zod"

interface Team {
	id: number
	name: string
	createdAt: Date
	updatedAt: Date
}

type Inputs = {
	homeTeam: number | null
	awayTeam: number | null
	winner: number | null
	homeScore: number | null
	awayScore: number | null
	date: Date
}

const schema = z.object({
	homeTeam: z.number().int().positive(),
	awayTeam: z.number().int().positive(),
	winner: z.number().int().positive(),
	homeScore: z.number().int().positive(),
	awayScore: z.number().int().positive(),
	date: z.date(),
})

export default function MatchForm() {
	const router = useRouter()

	const [teams, setTeams] = useState<Team[]>([])
	const [teamsError, setTeamsError] = useState<string | null>(null)
	const [teamsLoading, setTeamsLoading] = useState<boolean>(false)

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
			homeTeam: null,
			awayTeam: null,
			winner: null,
			homeScore: null,
			awayScore: null,
			date: new Date(),
		},
	})

	const postTeam = async (name: string): Promise<any> => {
		try {
			setLoading(true)

			const response = await fetch("/api/matchs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name }),
			})
			const data = await response.json()

			if (!response.ok) {
				setApiError(data.message)
			}

			setApiResponse(data.message)
		} finally {
			setLoading(false)
		}
	}

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		const { name } = data

		postTeam(name).then(() => (
			setTimeout(() => router.push("/teams"), 5000)
		))
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

		</div>
	)
}