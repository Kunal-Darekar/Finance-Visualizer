import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/context/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finance Visualizer",
  description: "Track and visualize your personal finances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <DataProvider>
          <div className="flex min-h-screen flex-col">
            <header className="bg-white shadow">
              <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                  <h1 className="text-xl font-bold">Finance Visualizer</h1>
                </div>
              </nav>
            </header>
            <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
