import { NextRequest, NextResponse } from "next/server"

import { logger } from "@/services/logger"
import prisma from "@/services/prisma"

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

export async function GET(): Promise<NextResponse> {
	try {
		const matches: Match[] = await prisma.match.findMany({
			include: {
				homeTeam: true,
				awayTeam: true,
				winner: true,
			},
		})

		return NextResponse.json(matches, { status: 200 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const { homeTeam, awayTeam, winner, homeScore, awayScore, date } = await request.json()

		await prisma.match.create({
			data: {
				homeTeamId : homeTeam,
				awayTeamId : awayTeam,
				winnerId : winner,
				homeTeamScore : homeScore,
				awayTeamScore : awayScore,
				matchDate: new Date(date),
				createdAt: new Date(),
				updatedAt: null,
			},
		})

		return NextResponse.json({ message: "Match créé" }, { status: 201 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}
