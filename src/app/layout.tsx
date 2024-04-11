import type { Metadata } from "next"
import "./globals.css"
import React from "react"

import Footer from "@/components/footer"
import Header from "@/components/header"

export const metadata: Metadata = {
	title: {
		template: "%s | TourNament",
		default: "Accueil | TourNament",
	},
	description: "TourNament est une application de gestion de tournois d'équipes",
	icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
	      <Header />
	      {children}
	      <Footer />
			</body>
    </html>
  )
}
