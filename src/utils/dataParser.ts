export interface AdsRow {
  searchTerm: string;
  keyword: string;
  matchType: string;
  campaign: string;
  adGroup: string;
  campaignStatus: string;
  adGroupStatus: string;
  clicks: number;
  cost: number;
  impressions: number;
  ctr: number;
  avgCpc: number;
  [key: string]: any;
}

export const parseAdsData = (rawText: string): AdsRow[] => {
  if (!rawText.trim()) return [];

  const lines = rawText.trim().split('\n');
  
  // 1. Encontrar a linha de cabeçalho real
  // A exportação Web tem metadados nas primeiras linhas. Procuramos pela linha que contém "Cliques" ou "Clicks".
  let headerIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('cliques') || line.includes('clicks')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) return [];

  const separator = lines[headerIndex].split('\t').length > lines[headerIndex].split(',').length ? '\t' : ',';
  const headers = lines[headerIndex].split(separator).map(h => h.trim().replace(/"/g, ''));
  
  const getHeaderIndex = (possibilities: string[]) => {
    return headers.findIndex(h => possibilities.some(p => h.toLowerCase() === p.toLowerCase() || h.toLowerCase().includes(p.toLowerCase())));
  };

  const idx = {
    // Na Web UI, "Palavra-chave" costuma ser a coluna principal se "Termo de pesquisa" não existir
    searchTerm: getHeaderIndex(['Search term', 'Termo de pesquisa', 'Palavra-chave', 'Keyword']),
    keyword: getHeaderIndex(['Keyword', 'Palavra-chave']),
    matchType: getHeaderIndex(['Criterion Type', 'Tipo de correspondência', 'Tipo de corresp.']),
    campaign: getHeaderIndex(['Campaign', 'Campanha']),
    adGroup: getHeaderIndex(['Ad Group', 'Grupo de anúncios']),
    campaignStatus: getHeaderIndex(['Campaign Status', 'Status da campanha', 'Status']),
    adGroupStatus: getHeaderIndex(['Ad Group Status', 'Status do grupo de anúncios']),
    clicks: getHeaderIndex(['Clicks', 'Cliques']),
    cost: getHeaderIndex(['Cost', 'Custo']),
    impressions: getHeaderIndex(['Impressions', 'Impressões', 'Impr.']),
    ctr: getHeaderIndex(['CTR']),
    avgCpc: getHeaderIndex(['Avg CPC', 'CPC médio', 'CPC méd.']),
  };

  const cleanNumber = (val: string): number => {
    if (!val || val === '--' || val.includes('--')) return 0;
    // Remove aspas, símbolos de moeda, espaços e troca vírgula decimal por ponto
    const cleaned = val.replace(/"/g, '').replace(/[R$\s%]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const dataRows = lines.slice(headerIndex + 1)
    .filter(line => {
      const l = line.trim();
      // Ignorar linhas vazias, linhas de separação "--" ou linhas de "Total"
      return l.length > 0 && !l.includes('Total:') && !l.startsWith('--');
    })
    .map(line => {
      const cols = line.split(separator).map(c => c.trim().replace(/"/g, ''));
      
      return {
        searchTerm: cols[idx.searchTerm] || 'N/A',
        keyword: cols[idx.keyword] || '',
        matchType: cols[idx.matchType] || '',
        campaign: cols[idx.campaign] || '',
        adGroup: cols[idx.adGroup] || '',
        campaignStatus: cols[idx.campaignStatus] || '',
        adGroupStatus: cols[idx.adGroupStatus] || '',
        clicks: cleanNumber(cols[idx.clicks]),
        cost: cleanNumber(cols[idx.cost]),
        impressions: cleanNumber(cols[idx.impressions]),
        ctr: cleanNumber(cols[idx.ctr]),
        avgCpc: cleanNumber(cols[idx.avgCpc]),
      };
    });

  return dataRows;
};