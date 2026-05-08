import { ModulePageTemplate } from '@/components/crm/module-ui';

export default function Page() {
  return (
    <ModulePageTemplate
      title="Calendar"
      description="Calendar module workspace with standardized list view structure."
      primaryCta={{ label: 'Create new', href: '#' }}
      secondaryCtas={[
        { label: 'Import', href: '#' },
        { label: 'Export', href: '#' },
      ]}
      filters={['Status', 'Owner', 'Date range', 'Tags']}
      tableTitle="Calendar list"
      emptyTitle="No records yet"
      emptyDescription="Start by creating the first record for this module."
      columns={['Name', 'Owner', 'Status', 'Updated']}
    />
  );
}
