import { NextRequest, NextResponse } from "next/server"

import { logger } from "@/services/logger"
import prisma from "@/services/prisma"

type Params = {
	teamId: number
}

interface Team {
	id: number
	name: string
	createdAt: Date
	updatedAt: Date | null
}

export async function GET(request: NextRequest, context: { params: Params }): Promise<NextResponse> {
	try {
		const { teamId } = context.params

		const team: Team | null = await prisma.team.findUnique(
			{
				where: {
					id: Number(teamId),
				},
			}
		)

		if (!team) {
			return NextResponse.json({ message: "Équipe non trouvée" }, { status: 404 })
		}

		const victories: number = await prisma.match.count({
			where: {
				winnerId: Number(teamId),
			},
		})

		const defeats: number = await prisma.match.count({
			where: {
				OR: [
					{
						homeTeamId: Number(teamId),
						winnerId: { not: Number(teamId) },
					},
					{
						awayTeamId: Number(teamId),
						winnerId: { not: Number(teamId) },
					},
				],
			},
		})

		const results = {
			team,
			stats: {
				victories,
				defeats
			}
		}

		return NextResponse.json(results, { status: 200 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}

export async function PUT(request: NextRequest, context: { params: Params }): Promise<NextResponse> {
	try {
		const { teamId } = context.params
		const { name } = await request.json()

		const teamToUpdate: Team | null = await prisma.team.findUnique(
			{
				where: {
					id: Number(teamId),
				},
			}
		)

		if (!teamToUpdate) {
			return NextResponse.json({ message: "Équipe non trouvée" }, { status: 404 })
		}

		const updatedTeam: Team = await prisma.team.update(
			{
				where: {
					id: Number(teamId),
				},
				data: {
					name,
				},
			}
		)

		return NextResponse.json(updatedTeam, { status: 200 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest, context: { params: Params }): Promise<NextResponse> {
	try {
		const { teamId } = context.params

		const teamToDelete: Team | null = await prisma.team.findUnique(
			{
				where: {
					id: Number(teamId),
				},
			}
		)

		if (!teamToDelete) {
			return NextResponse.json({ message: "Équipe non trouvée" }, { status: 404 })
		}

		await prisma.team.delete(
			{
				where: {
					id: Number(teamId),
				},
			}
		)

		return NextResponse.json({ message: "Équipe supprimée" }, { status: 200 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}