import ogImage from "../../public/chessGame.PNG";
import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Overpass({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lets-play-chess",
  description: "Play chess with friends",
  openGraph: {
    images: [
      { url: ogImage.src, width: ogImage.width, height: ogImage.height },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#">
      {/* <IconContext.Provider value={{ style: { height:"3em",width:"3em" } }}> */}

      <body className={inter.className}>{children}</body>
      {/* </IconContext.Provider> */}
    </html>
  );
}
