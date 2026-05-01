export type PortfolioAsset = {
  id: string;
  name: string;
  balance: number;
  bucket: 'CORE' | 'MOONSHOT';
};

export const portfolioAssets: PortfolioAsset[] = [
  { id: 'bitcoin', name: 'Bitcoin', balance: 0.15, bucket: 'CORE' },
  { id: 'ethereum', name: 'Ethereum', balance: 2.5, bucket: 'CORE' },
  { id: 'autonolas', name: 'Autonolas', balance: 750, bucket: 'MOONSHOT' },
  { id: 'aethir', name: 'Aethir', balance: 10000, bucket: 'MOONSHOT' },
  { id: 'nosana', name: 'Nosana', balance: 500, bucket: 'MOONSHOT' },
  { id: 'fluence', name: 'Fluence', balance: 1500, bucket: 'MOONSHOT' },
  { id: 'clearpool', name: 'Clearpool', balance: 2500, bucket: 'MOONSHOT' },
  { id: 'maple', name: 'Maple', balance: 300, bucket: 'MOONSHOT' },
  { id: 'goldfinch', name: 'Goldfinch', balance: 1200, bucket: 'MOONSHOT' },
  { id: 'paal-ai', name: 'PAAL AI', balance: 5000, bucket: 'MOONSHOT' },
  { id: '0x0-ai-smart-contract', name: '0x0.ai', balance: 2000, bucket: 'MOONSHOT' },
];

export const coinIds = portfolioAssets.map((asset) => asset.id);
