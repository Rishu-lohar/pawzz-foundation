
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PawzzCare | Animal Care Discovery",
  description:
    "Discover veterinary clinics, animal hospitals and pet care services near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
