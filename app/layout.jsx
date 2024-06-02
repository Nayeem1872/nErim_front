"use client";

import TanstackProvider from "@/provider/TanstackProvider";
import { Inter } from "next/font/google";
import { Suspense, useEffect } from "react";
import "./globals.css";
import i18next from "../i18n";
import Loading from "./dashboard/loading";


const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({ children }) {
  useEffect(() => {
    const lang = localStorage.getItem("lang");
    i18next.changeLanguage(lang);
    if (!lang) {
      localStorage.setItem("lang", "en");
      i18next.changeLanguage("en");
    }
  }, []);



  return (
    <>
      <html lang="en">
        <body className={inter.className}>

          <TanstackProvider>
          <Suspense fallback={<Loading/>}>
            
            {children}
            
            
          </Suspense>
            </TanstackProvider>
        </body>
      </html>
    </>
  );
}
