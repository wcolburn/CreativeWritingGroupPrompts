import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creative Writing Group Prompts",
  description: "Created by William Colburn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
