import { DetailPageTemplate } from '@/components/crm/detail-ui';

export default function QuoteDetailPage() {
  return <DetailPageTemplate title="Quote Detail" subtitle="Quote approvals and version control." status={{ label: 'Pending approval', tone: 'neutral' }} tabs={['Overview', 'Line items', 'Approvals', 'History']} leftPaneTitle="Quote composition" rightPaneTitle="Approval workflow" />;
}
