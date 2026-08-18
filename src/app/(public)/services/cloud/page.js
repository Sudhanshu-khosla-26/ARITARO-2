import DynamicServicePage, { generateMetadata as dynamicMetadata } from '../[slug]/page';

export async function generateMetadata() {
  return dynamicMetadata({ params: Promise.resolve({ slug: 'cloud' }) });
}

export default async function CloudPage() {
  return <DynamicServicePage params={Promise.resolve({ slug: 'cloud' })} />;
}
