import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import Head from "next/head";


const inter = Overpass({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lets-play-chess",
  description: "Play chess with friends",
  openGraph:{images:["https://opengraph.b-cdn.net/production/documents/a9f33a88-54ff-44b3-a934-777d0bcf34fc.png?token=ecgxsB6Td4D6YWlwxXM-tX7ZN6qk6Af4ZBugR_scaL8&height=963&width=1149&expires=33245865403"]}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  prefix="og: https://ogp.me/ns#">
 
 

        {/* <IconContext.Provider value={{ style: { height:"3em",width:"3em" } }}> */}

      <body className={inter.className}>{children}</body>
        {/* </IconContext.Provider> */}
    </html>
  );
}
