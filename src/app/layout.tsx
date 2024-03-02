import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";


const inter = Overpass({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lets-play-chess",
  description: "Play chess with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  prefix="og: https://ogp.me/ns#">
   

   <meta name="viewport" content="width=1000; " />
   <meta property="og:type" content="website"/>
   <meta property="og:image" content="https://imgur.com/5gmADj3"/>
        {/* <IconContext.Provider value={{ style: { height:"3em",width:"3em" } }}> */}

      <body className={inter.className}>{children}</body>
        {/* </IconContext.Provider> */}
    </html>
  );
}
