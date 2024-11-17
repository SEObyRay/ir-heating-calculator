import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://infraroodverwarming-soest.nl'),
  title: {
    default: 'Infrarood Verwarming Calculator | Expert Advies',
    template: '%s | Infrarood Verwarming Soest'
  },
  description: 'Bereken gratis het benodigde vermogen voor uw infrarood verwarming. Professioneel advies van HVAC-experts voor hoofdverwarming en bijverwarming.',
  keywords: ['infrarood verwarming', 'IR panelen', 'vermogen berekenen', 'energiebesparing', 'duurzame verwarming', 'elektrische verwarming', 'infrarood calculator'],
  authors: [{ name: 'HVAC Experts Soest' }],
  creator: 'Infrarood Verwarming Soest',
  publisher: 'Infrarood Verwarming Soest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Infrarood Verwarming Calculator | Expert Advies',
    description: 'Bereken gratis het benodigde vermogen voor uw infrarood verwarming. Professioneel advies van HVAC-experts.',
    url: 'https://infraroodverwarming-soest.nl',
    siteName: 'Infrarood Verwarming Soest',
    locale: 'nl_NL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        {children}
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Infrarood Verwarming Calculator",
              "url": "https://infraroodverwarming-soest.nl",
              "description": "Professionele calculator voor het berekenen van infrarood verwarmingsvermogen",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              },
              "provider": {
                "@type": "Organization",
                "name": "Infrarood Verwarming Soest",
                "url": "https://infraroodverwarming-soest.nl",
                "description": "Specialist in infrarood verwarmingsoplossingen",
                "areaServed": {
                  "@type": "State",
                  "name": "Utrecht",
                  "containsPlace": {
                    "@type": "City",
                    "name": "Soest"
                  }
                }
              },
              "review": {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "4.8",
                  "bestRating": "5"
                },
                "author": {
                  "@type": "Organization",
                  "name": "HVAC Experts Nederland"
                }
              },
              "about": {
                "@type": "Thing",
                "name": "Infrarood Verwarming",
                "description": "Duurzame verwarmingsoplossing die direct warmte geeft via infraroodstraling"
              }
            }
          `}
        </Script>
        <Script id="faq-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Wat is het verschil tussen infrarood hoofdverwarming en bijverwarming?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hoofdverwarming is bedoeld om een hele ruimte te verwarmen (30-40W per m³), terwijl bijverwarming gericht is op specifieke zones (120-150W per m²). Hoofdverwarming heeft een langere opwarmtijd maar geeft gelijkmatigere warmte."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat is de terugverdientijd van infrarood verwarming?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "De terugverdientijd ligt gemiddeld tussen 3-7 jaar, afhankelijk van energiekosten, isolatie, gebruikspatroon en combinatie met zonnepanelen. Met een levensduur van 20-25 jaar is het een gunstige investering."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Hoeveel elektriciteit verbruikt infrarood verwarming?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Een 600W paneel dat 6 uur per dag aanstaat, verbruikt 3.6 kWh per dag. Het verbruik is gemiddeld 20-30% lager dan traditionele elektrische verwarming door efficiënte warmteafgifte."
                  }
                }
              ]
            }
          `}
        </Script>
      </body>
    </html>
  )
}
