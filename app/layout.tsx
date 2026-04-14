import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URFC TV",
  description: "Is URFC playing today?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-black">
        {children}
      </body>
    </html>
  );
}
