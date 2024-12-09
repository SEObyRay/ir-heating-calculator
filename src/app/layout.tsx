import './globals.css';
import { StroomprijsProvider } from '../context/StroomprijsContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vermogen infrarood verwarming berekenen met onze handige calculator',
  description: 'Bereken eenvoudig het benodigde vermogen voor infrarood verwarming met onze calculator. Ontdek hoeveel watt je nodig hebt voor jouw infrarood panelen!',
  keywords: 'infrarood verwarming, IR verwarming, verwarmingscalculator, energiekosten, duurzaam verwarmen, elektrisch verwarmen, IR panelen, stroomkosten berekenen, warmteberekening, isolatie advies',
  authors: [{ name: 'IR Verwarming Calculator' }],
  creator: 'IR Verwarming Calculator',
  publisher: 'IR Verwarming Calculator',
  openGraph: {
    title: 'IR Verwarming Calculator | Bereken je Verwarmingskosten',
    description: 'Bereken direct hoeveel infrarood panelen je nodig hebt en wat de kosten zijn. Inclusief actuele stroomprijzen en persoonlijk advies.',
    type: 'website',
    locale: 'nl_NL',
    siteName: 'IR Verwarming Calculator'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IR Verwarming Calculator | Bereken je Verwarmingskosten',
    description: 'Bereken direct hoeveel infrarood panelen je nodig hebt en wat de kosten zijn. Inclusief actuele stroomprijzen en persoonlijk advies.',
  },
  alternates: {
    canonical: 'https://ir-verwarming-calculator.nl'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'verification_token',
  },
  category: 'technology',
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
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
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
      <body>
        <StroomprijsProvider>
          {children}
        </StroomprijsProvider>
      </body>
    </html>
  );
}
