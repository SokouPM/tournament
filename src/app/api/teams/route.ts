import { NextRequest, NextResponse } from "next/server"

import { logger } from "@/services/logger"
import prisma from "@/services/prisma"

interface Team {
	id: number
	name: string
	createdAt: Date
	updatedAt: Date | null
}

export async function GET(): Promise<NextResponse> {
	try {
		const teams: Team[] = await prisma.team.findMany()

		return NextResponse.json(teams, { status: 200 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const { name } = await request.json()

		await prisma.team.create({
			data: {
				name,
				createdAt: new Date(),
				updatedAt: null,
			},
		})

		return NextResponse.json({message: "L'équipe a été créée"}, { status: 201 })
	} catch (error: any) {
		logger.error(error)

		return NextResponse.json({ message: "Une erreur inattendue est survenue" }, { status: 500 })
	}
}
