import React, { useEffect, useState } from 'react';

interface SchemaOrgProps {
  faqItems: Array<{
    id: string;
    question: string;
    answer: string;
  }>;
}

const SchemaOrg: React.FC<SchemaOrgProps> = ({ faqItems }) => {
  const [schemaScript, setSchemaScript] = useState('');

  useEffect(() => {
    const cleanAnswer = (answer: string) => {
      return answer.replace(/\s+/g, ' ').trim();
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://infraroodcalculator.nl'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Veelgestelde Vragen',
          item: 'https://infraroodcalculator.nl/#faq'
        }
      ]
    };

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Infrarood Calculator',
      url: 'https://infraroodcalculator.nl',
      description: 'Bereken eenvoudig het benodigde vermogen voor infrarood verwarming met onze calculator.',
      logo: 'https://infraroodcalculator.nl/logo.png',
      sameAs: [
        'https://infraroodcalculator.nl'
      ]
    };

    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Infrarood Calculator',
      url: 'https://infraroodcalculator.nl',
      applicationCategory: 'UtilityApplication',
      description: 'Online calculator voor het berekenen van het benodigde vermogen en kosten van infrarood verwarming.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR'
      },
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '1.0'
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        id: `https://infraroodcalculator.nl/#${item.id}`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cleanAnswer(item.answer)
        }
      }))
    };

    const allSchemas = [
      breadcrumbSchema,
      organizationSchema,
      webAppSchema,
      faqSchema
    ];

    setSchemaScript(JSON.stringify(allSchemas));
  }, [faqItems]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaScript }}
      key="schema-org"
    />
  );
};

export default SchemaOrg;
