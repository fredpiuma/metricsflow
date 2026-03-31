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
  if (lines.length < 2) return [];

  // Detectar separador (Tab para TSV do Editor, vírgula para CSV padrão)
  const firstLine = lines[0];
  const separator = firstLine.split('\t').length > firstLine.split(',').length ? '\t' : ',';
  
  const headers = firstLine.split(separator).map(h => h.trim());
  
  // Mapeamento de cabeçalhos comuns (suporta PT-BR e EN)
  const getHeaderIndex = (possibilities: string[]) => {
    return headers.findIndex(h => possibilities.some(p => h.toLowerCase().includes(p.toLowerCase())));
  };

  const idx = {
    searchTerm: getHeaderIndex(['Search term', 'Termo de pesquisa']),
    keyword: getHeaderIndex(['Keyword', 'Palavra-chave']),
    matchType: getHeaderIndex(['Criterion Type', 'Tipo de correspondência']),
    campaign: getHeaderIndex(['Campaign', 'Campanha']),
    adGroup: getHeaderIndex(['Ad Group', 'Grupo de anúncios']),
    campaignStatus: getHeaderIndex(['Campaign Status', 'Status da campanha']),
    adGroupStatus: getHeaderIndex(['Ad Group Status', 'Status do grupo de anúncios']),
    clicks: getHeaderIndex(['Clicks', 'Cliques']),
    cost: getHeaderIndex(['Cost', 'Custo']),
    impressions: getHeaderIndex(['Impressions', 'Impressões']),
    ctr: getHeaderIndex(['CTR']),
    avgCpc: getHeaderIndex(['Avg CPC', 'CPC médio']),
  };

  const cleanNumber = (val: string): number => {
    if (!val) return 0;
    // Remove símbolos de moeda, espaços e troca vírgula decimal por ponto se necessário
    const cleaned = val.replace(/[R$\s%]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  return lines.slice(1).map(line => {
    const cols = line.split(separator);
    
    return {
      searchTerm: cols[idx.searchTerm]?.trim() || 'N/A',
      keyword: cols[idx.keyword]?.trim() || '',
      matchType: cols[idx.matchType]?.trim() || '',
      campaign: cols[idx.campaign]?.trim() || '',
      adGroup: cols[idx.adGroup]?.trim() || '',
      campaignStatus: cols[idx.campaignStatus]?.trim() || '',
      adGroupStatus: cols[idx.adGroupStatus]?.trim() || '',
      clicks: cleanNumber(cols[idx.clicks]),
      cost: cleanNumber(cols[idx.cost]),
      impressions: cleanNumber(cols[idx.impressions]),
      ctr: cleanNumber(cols[idx.ctr]),
      avgCpc: cleanNumber(cols[idx.avgCpc]),
    };
  });
};