import { DetailPageTemplate } from '@/components/crm/detail-ui';

export default function CustomerDetailPage() {
  return <DetailPageTemplate title="Customer Detail" subtitle="Customer account and relationship management." status={{ label: 'Active', tone: 'success' }} tabs={['Overview', 'Projects', 'Billing', 'Support']} leftPaneTitle="Account summary" rightPaneTitle="Related operations" />;
}
