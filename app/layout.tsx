// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Image App", description: "Simple image app" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex gap-4">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/dashboard">Admin</Link>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
