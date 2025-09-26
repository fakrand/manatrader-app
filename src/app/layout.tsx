// This file is intentionally blank. 
// The root layout is now handled by src/app/[lang]/layout.tsx
// to ensure proper handling of internationalization.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
