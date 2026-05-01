import { DetailPageTemplate } from '@/components/crm/detail-ui';

export default function ProjectDetailPage() {
  return <DetailPageTemplate title="Project Detail" subtitle="Project execution and delivery tracking." status={{ label: 'At risk', tone: 'warning' }} tabs={['Overview', 'Tasks', 'Financials', 'Files']} leftPaneTitle="Delivery pane" rightPaneTitle="Dependencies pane" />;
}
