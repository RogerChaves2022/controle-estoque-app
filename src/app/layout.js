import './styles/global.css'
export const metadata = {
  title: 'Controle Estoque App',
  description: 'Controle de estoque para descarte de produtos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="body">{children}</body>
    </html>
  )
}
