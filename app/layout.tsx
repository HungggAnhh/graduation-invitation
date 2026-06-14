import type { Metadata, Viewport } from 'next'
import type { PropsWithChildren } from 'react'
import { RealViewport } from '~/components/real-viewport'
import AppData from '~/package.json'

import '~/styles/css/index.css'

import { fontsVariable } from '~/styles/fonts'

const APP_NAME = AppData.name
const APP_DEFAULT_TITLE = 'Graduation HungAnh'
const APP_TITLE_TEMPLATE = '%s - Graduation Ceremony'
const APP_DESCRIPTION = AppData.description
const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'https://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(APP_BASE_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: APP_BASE_URL,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: APP_DEFAULT_TITLE,
      },
    ],
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  themeColor: '#080d1a',
  colorScheme: 'dark',
}

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="vi"
      dir="ltr"
      className={fontsVariable}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <RealViewport />
        {children}
      </body>
    </html>
  )
}
