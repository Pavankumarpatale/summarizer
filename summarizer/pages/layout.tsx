import type { Metadata } from 'next'
 
// These styles apply to every route in the application
 
// export const metadata: Metadata = {
//   title: 'Text Summarizer',
//   description: 'Text Summarization App',
// }
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
