import type { Metadata } from "next";
import { UserContextProvider } from "@/context/userContext";
import { GroupContextProvider } from "@/context/groupContext";

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
      <UserContextProvider>
        <GroupContextProvider>
          <body>
            {children}
          </body>
        </GroupContextProvider>
      </UserContextProvider>
    </html>
  );
}
