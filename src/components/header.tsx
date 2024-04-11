import Link from "next/link"

export default function Header() {
	const navItems = [
		{
			title: "Équipes",
			href: "/teams",
			subItems: [
				{ title: "Liste", href: "/teams" },
				{ title: "Créer", href: "/teams/create" },
			],
		},
		{
			title: "Matchs",
			href: "/matches",
			subItems: [
				{ title: "Liste", href: "/matches" },
				{ title: "Créer", href: "/matches/create" },
			],
		},
	]

	return (
		<header className="navbar bg-base-300">
			<div className="navbar-start">
				<div className="dropdown">
					<div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="size-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
						</svg>
					</div>
					<ul tabIndex={0} className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
						{navItems.map((item, index) => (
							<li key={index}>
								<a href={item.href}>{item.title}</a>
								{item.subItems && (
									<ul className="p-2">
										{item.subItems.map((subItem, subIndex) => (
											<li key={subIndex}>
												<a href={subItem.href}>{subItem.title}</a>
											</li>
										))}
									</ul>
								)}
							</li>
						))}
					</ul>
				</div>
				<Link href="/" className="btn btn-ghost text-xl">
					TourNament
				</Link>
			</div>
			<div className="navbar-end hidden lg:flex">
				<ul className="menu menu-horizontal px-1">
					{navItems.map((item, index) => (
						<li key={index}>
							{item.subItems ? (
								<details>
									<summary>{item.title}</summary>
									<ul className="p-2">
										{item.subItems.map((subItem, subIndex) => (
											<li key={subIndex}>
												<Link href={subItem.href}>{subItem.title}</Link>
											</li>
										))}
									</ul>
								</details>
							) : (
								<Link href={item.href}>{item.title}</Link>
							)}
						</li>
					))}
				</ul>
			</div>
		</header>
	)
}