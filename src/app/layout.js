import '@/styles/globals.css'
import StyledComponentsRegistry from './lib/registry';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TuneTrove',
  description: 'Web app to visualize personalized Spotify data',
};

export const viewport = {
  themeColor: '#1DB954'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
};
