import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | MR MOBILE WALA REPAIRS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
