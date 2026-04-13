import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: '"Yosh Bilimdonlar" Olimpiadasi',
  description: "Oʼzbekiston Respublikasi Ichki Ishlar Vazirligi Buvayda tumani boʼlimi boshligʼi tarzadon tashkil etilgan \"Yosh Bilimdonlar\" Olimpiadasiga ro'yxatdan o'tish.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
