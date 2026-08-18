import DynamicServicePage, { generateMetadata as dynamicMetadata } from '../[slug]/page';

export async function generateMetadata() {
  return dynamicMetadata({ params: Promise.resolve({ slug: 'api-pt' }) });
}

export default async function ApiPtPage() {
  return <DynamicServicePage params={Promise.resolve({ slug: 'api-pt' })} />;
}
