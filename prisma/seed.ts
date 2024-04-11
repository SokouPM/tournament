import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const teamNames = [
	"Les Aigles",
	"Les Lions",
	"Les Tigres",
	"Les Loups",
	"Les Panthers",
	"Les Oursons",
	"Les Grizzlis",
	"Les Renards",
	"Les Étoiles",
	"Les Faucons"
]

async function main() {
	await prisma.team.deleteMany()
	await prisma.match.deleteMany()

	for (let i = 1; i <= teamNames.length; i++) {
		await prisma.team.upsert({
			where: { id: i},
			update: {},
			create: {
				id: i,
				name: teamNames[i - 1],
				updatedAt: null,
			},
		})
	}

	for (let i = 1; i <= 50; i++) {
		const homeTeamId = Math.floor(Math.random() * 10) + 1
		let awayTeamId = Math.floor(Math.random() * 10) + 1

		while (awayTeamId === homeTeamId) {
			awayTeamId = Math.floor(Math.random() * 10) + 1
		}

		let winnerId = Math.floor(Math.random() * 10) + 1

		if (winnerId !== homeTeamId || winnerId !== awayTeamId) {
			winnerId = Math.random() < 0.5 ? homeTeamId : awayTeamId
		}

		let homeTeamScore = Math.floor(Math.random() * 10)
		let awayTeamScore = Math.floor(Math.random() * 10)

		if (winnerId === homeTeamId && homeTeamScore <= awayTeamScore) {
			homeTeamScore = awayTeamScore + Math.floor(Math.random() * 10)
		}

		if (winnerId === awayTeamId && awayTeamScore <= homeTeamScore) {
			awayTeamScore = homeTeamScore + Math.floor(Math.random() * 10)
		}

		const matchDate = new Date()
		matchDate.setDate(matchDate.getDate() - Math.floor(Math.random() * 365))

		await prisma.match.upsert({
			where: { id: i },
			update: {},
			create: {
				id: i,
				homeTeamId: homeTeamId,
				awayTeamId: awayTeamId,
				winnerId: winnerId,
				homeTeamScore: homeTeamScore,
				awayTeamScore: awayTeamScore,
				matchDate: matchDate,
				updatedAt: null,
			},
		})
	}
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async () => {
		await prisma.$disconnect()
		process.exit(1)
	})