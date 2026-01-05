import './globals.css'

export const metadata = {
  title: 'Client-Side Menu Generator',
  description: 'Generate menus for Saudi businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}