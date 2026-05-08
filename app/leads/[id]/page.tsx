import { DetailPageTemplate } from '@/components/crm/detail-ui';

export default function LeadDetailPage() {
  return <DetailPageTemplate title="Lead Detail" subtitle="Lead qualification and conversion workflow." status={{ label: 'Qualified', tone: 'info' }} tabs={['Overview', 'Activities', 'Contacts', 'Documents']} leftPaneTitle="Lead profile" rightPaneTitle="Deal context" />;
}
