import { NextRequest, NextResponse } from "next/server"

import { logger } from "@/services/logger"
import prisma from "@/services/prisma"

type Params = {
	matchId: number
}

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
}

export async function GET(request: NextRequest, context: { params: Params }): Promise<NextResponse> {
	try {
		const { matchId } = context.params

		const match: Match | null = await prisma.match.findUnique(
			{
				where: {
					id: Number(matchId),
				},
				include: {
					homeTeam: true,
					awayTeam: true,
					winner: true,
				},
			}
		)

		if (!match) {
			return NextResponse.json({ message: "Match non trouvée" }, { status: 404 })
		}

		return NextResponse.json(match, { status: 200 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}

export async function PUT(request: NextRequest, context: { params: Params }): Promise<NextResponse> {
	try {
		const { matchId } = context.params
		const { homeTeam, awayTeam, winner, homeScore, awayScore, date } = await request.json()

		const matchToUpdate: Match | null = await prisma.match.findUnique(
			{
				where: {
					id: Number(matchId),
				},
			}
		)

		if (!matchToUpdate) {
			return NextResponse.json({ message: "Match non trouvée" }, { status: 404 })
		}

		const updatedMatch: Match = await prisma.match.update(
			{
				where: {
					id: Number(matchId),
				},
				data: {
					homeTeamId : homeTeam,
					awayTeamId : awayTeam,
					winnerId : winner,
					homeTeamScore : homeScore,
					awayTeamScore : awayScore,
					matchDate: new Date(date),
				},
			}
		)

		return NextResponse.json(updatedMatch, { status: 200 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}

export async function DELETE(request: NextRequest, context: { params: Params }): Promise<NextResponse> {
	try {
		const { matchId } = context.params

		const matchToDelete: Match | null = await prisma.match.findUnique(
			{
				where: {
					id: Number(matchId),
				},
			}
		)

		if (!matchToDelete) {
			return NextResponse.json({ message: "Match non trouvée" }, { status: 404 })
		}

		await prisma.match.delete(
			{
				where: {
					id: Number(matchId),
				},
			}
		)

		return NextResponse.json({ message: "Match supprimée" }, { status: 200 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}