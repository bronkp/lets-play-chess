import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import { IconContext } from "react-icons";
import Head from "next/head";

const inter = Overpass({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chess",
  description: "Chess Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
   

   <meta name="viewport" content="width=1000; " />
      

        {/* <IconContext.Provider value={{ style: { height:"3em",width:"3em" } }}> */}

      <body className={inter.className}>{children}</body>
        {/* </IconContext.Provider> */}
    </html>
  );
}
