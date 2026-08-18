import DynamicServicePage, { generateMetadata as dynamicMetadata } from '../[slug]/page';

export async function generateMetadata() {
  return dynamicMetadata({ params: Promise.resolve({ slug: 'wap-pt' }) });
}

export default async function WapPtPage() {
  return <DynamicServicePage params={Promise.resolve({ slug: 'wap-pt' })} />;
}
