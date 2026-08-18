import DynamicServicePage, { generateMetadata as dynamicMetadata } from '../[slug]/page';

export async function generateMetadata() {
  return dynamicMetadata({ params: Promise.resolve({ slug: 'ai-pt' }) });
}

export default async function AiPtPage() {
  return <DynamicServicePage params={Promise.resolve({ slug: 'ai-pt' })} />;
}
