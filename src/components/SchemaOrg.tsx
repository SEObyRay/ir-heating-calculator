import React, { useEffect, useState } from 'react';

interface SchemaOrgProps {
  faqItems: Array<{
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

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'IR Verwarming Calculator',
      url: 'https://infraroodcalculator.nl',
      description: 'Bereken eenvoudig het benodigde vermogen voor infrarood verwarming met onze calculator.',
      logo: 'https://infraroodcalculator.nl/logo.png'
    };

    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'IR Verwarming Calculator',
      url: 'https://infraroodcalculator.nl',
      applicationCategory: 'UtilityApplication',
      description: 'Online calculator voor het berekenen van het benodigde vermogen en kosten van infrarood verwarming.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR'
      }
    };

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: cleanAnswer(item.answer)
        }
      }))
    };

    setSchemaScript(JSON.stringify([organizationSchema, webAppSchema, faqSchema]));
  }, [faqItems]);

  return schemaScript ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: schemaScript
      }}
    />
  ) : null;
};

export default SchemaOrg;
