import './globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import { StroomprijsProvider } from '../context/StroomprijsContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://infraroodcalculator.nl'),
  title: {
    default: 'Vermogen infrarood verwarming berekenen | Hoeveel watt per m²',
    template: '%s | Infrarood Calculator'
  },
  description: 'Bereken het benodigde vermogen voor uw infrarood panelen. Ontdek hoeveel watt u nodig heeft voor verwarming met onze handige calculator voor infraroodpanelen.',
  keywords: 'infrarood verwarming, IR verwarming, verwarmingscalculator, energiekosten, duurzaam verwarmen, elektrisch verwarmen, IR panelen, stroomkosten berekenen, warmteberekening, isolatie advies',
  authors: [{ name: 'IR Verwarming Calculator' }],
  creator: 'IR Verwarming Calculator',
  publisher: 'IR Verwarming Calculator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://infraroodcalculator.nl',
    siteName: 'Infrarood Calculator',
    title: 'Infrarood Verwarming Calculator | Bereken je Verwarmingskosten',
    description: 'Bereken direct hoeveel infrarood panelen je nodig hebt en wat de kosten zijn. Inclusief actuele stroomprijzen en persoonlijk advies.',
    images: [
      {
        url: 'https://infraroodcalculator.nl/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Infrarood Calculator Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infrarood Calculator | Bereken je Verwarmingskosten',
    description: 'Bereken direct hoeveel infrarood panelen je nodig hebt en wat de kosten zijn. Inclusief actuele stroomprijzen en persoonlijk advies.',
    images: ['https://infraroodcalculator.nl/og-image.jpg']
  },
  alternates: {
    canonical: 'https://infraroodcalculator.nl'
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
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://infraroodcalculator.nl'
      }
    ]
  };

  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#FF6B6B" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured data voor Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "IR Verwarming Calculator",
              "description": "Bereken eenvoudig het benodigde vermogen en kosten voor infrarood verwarming in je woning.",
              "applicationCategory": "Calculator",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              },
              "featureList": [
                "Berekening benodigd vermogen",
                "Kostenberekening",
                "Isolatie advies",
                "Actuele stroomprijzen",
                "Persoonlijk advies"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="min-h-screen px-4 py-8 md:py-12">
          <StroomprijsProvider>
            {children}
          </StroomprijsProvider>
        </div>
      </body>
    </html>
  );
}
