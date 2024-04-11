"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { MdCheckCircleOutline, MdErrorOutline } from "react-icons/md"
import { z } from "zod"

type Inputs = {
	name: string
}

const schema = z.object({
	name: z.string().min(3, "Le nom de l'équipe doit contenir au moins 3 caractères"),
})

export default function TeamForm() {
	const router = useRouter()
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
			name: "",
		},
	})

	const postTeam = async (name: string): Promise<any> => {
		try {
			setLoading(true)

			const response = await fetch("/api/teams", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name }),
			})
			const data = await response.json()

			if (!response.ok) {
				setApiError(data.message)

				return
			}

			setApiResponse(data.message)
			setTimeout(() => router.push("/teams"), 2000)
		} finally {
			setLoading(false)
		}
	}

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		const { name } = data

		postTeam(name).then()
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
						<span>Succès : {apiResponse}, vous allez être redirigé vers la liste des équipes</span>
					</div>
				)
			)}

			<form className="mx-auto w-8/12 rounded p-5 shadow-xl" onSubmit={handleSubmit(onSubmit)}>
				<label htmlFor="name" className="w-full">
					<div className="label">
						<span className="label-text text-xl font-bold">Nom de l'équipe</span>
					</div>
					<input
						type="text"
						id="name"
						className={`input input-bordered w-full ${errors.name && "input-error text-error"}`}
						{...register("name")}
					/>
					<div className="label">
						{errors.name && <span className="label-text-alt text-error">{errors.name.message}</span>}
					</div>
				</label>
				<input type="submit" value="Ajouter" className="btn btn-accent" />
			</form>
		</div>
	)
}