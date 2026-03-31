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

// Dicionário de traduções para padronizar os tipos de correspondência
const MATCH_TYPE_TRANSLATIONS: Record<string, string> = {
  'ai max': 'AI Max',
  'broad match': 'Correspondência ampla',
  'correspondência ampla': 'Correspondência ampla',
  'correspondência de frase': 'Correspondência de frase',
  'correspondência exata': 'Correspondência exata',
  'exact match': 'Correspondência exata',
  'exact match close variant': 'Correspondência exata variação',
  'phrase match': 'Correspondência de frase',
  'phrase match close variant': 'Correspondência de frase variação'
};

const translateMatchType = (raw: string): string => {
  if (!raw) return '';
  const normalized = raw.toLowerCase().trim();
  return MATCH_TYPE_TRANSLATIONS[normalized] || raw; // Fallback para o original se não encontrar
};

// Helper para ler linhas CSV/TSV corretamente
const parseLine = (line: string, separator: string): string[] => {
  if (separator === '\t') return line.split('\t');
  
  const arr = [];
  let inQuotes = false;
  let curr = '';
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === separator && !inQuotes) {
      arr.push(curr);
      curr = '';
    } else {
      curr += char;
    }
  }
  arr.push(curr);
  return arr;
};

export const parseAdsData = (rawText: string): AdsRow[] => {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n');
  
  let headerIndex = -1;
  let separator = '\t';
  let headers: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const currentSep = line.includes('\t') ? '\t' : ',';
    const cols = parseLine(line, currentSep);
    
    const normalizedCols = cols.map(c => c.toLowerCase().trim().replace(/^"|"$/g, ''));
    
    if (normalizedCols.includes('cliques') || normalizedCols.includes('clicks')) {
      headerIndex = i;
      separator = currentSep;
      headers = normalizedCols;
      break;
    }
  }

  if (headerIndex === -1) return [];

  const findCol = (aliases: string[]) => {
    return headers.findIndex(h => aliases.includes(h));
  };

  const idx = {
    searchTerm: findCol(['search term', 'termo de pesquisa']) !== -1 
      ? findCol(['search term', 'termo de pesquisa']) 
      : findCol(['palavra-chave', 'keyword', 'critério de pesquisa']),
    keyword: findCol(['keyword', 'palavra-chave']),
    matchType: findCol(['criterion type', 'tipo de correspondência', 'tipo de corresp.', 'match type']),
    campaign: findCol(['campaign', 'campanha']),
    adGroup: findCol(['ad group', 'grupo de anúncios']),
    campaignStatus: findCol(['campaign status', 'status da campanha']),
    adGroupStatus: findCol(['ad group status', 'status do grupo de anúncios', 'status']),
    clicks: findCol(['clicks', 'cliques']),
    cost: findCol(['cost', 'custo']),
    impressions: findCol(['impressions', 'impressões', 'impr.']),
    ctr: findCol(['ctr', 'taxa de cliques']),
    avgCpc: findCol(['avg cpc', 'cpc médio', 'cpc méd.']),
  };

  const cleanText = (val: string | undefined): string => {
    if (!val) return '';
    return val.replace(/^"|"$/g, '').trim();
  };

  // Limpa caracteres especiais [ ] e " usados para indicar correspondência na web UI
  const cleanKeyword = (val: string | undefined): string => {
    if (!val) return '';
    return val.replace(/["[\]]/g, '').trim();
  };

  const cleanNumber = (val: string | undefined): number => {
    if (!val) return 0;
    let cleaned = val.replace(/"/g, '').trim();
    if (cleaned === '--' || cleaned === '') return 0;
    
    cleaned = cleaned.replace(/[R$\s%]/gi, '');
    
    const match = cleaned.match(/[.,]/g);
    if (match && match.length > 0) {
      const lastPunctuation = match[match.length - 1];
      if (lastPunctuation === ',') {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        cleaned = cleaned.replace(/,/g, '');
      }
    }
    
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const dataRows: AdsRow[] = [];

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;

    const cols = parseLine(line, separator);
    
    const lineStr = line.toLowerCase();
    if (lineStr.includes('total:') || lineStr.startsWith('--')) continue;

    if (cols.length <= Math.max(idx.clicks, idx.impressions)) continue;

    const searchTermStr = idx.searchTerm !== -1 ? cleanKeyword(cols[idx.searchTerm]) : 'N/A';
    const keywordStr = idx.keyword !== -1 ? cleanKeyword(cols[idx.keyword]) : '';
    const finalTerm = (searchTermStr !== 'N/A' && searchTermStr !== '') ? searchTermStr : keywordStr;

    dataRows.push({
      searchTerm: finalTerm,
      keyword: keywordStr,
      matchType: idx.matchType !== -1 ? translateMatchType(cleanText(cols[idx.matchType])) : '',
      campaign: idx.campaign !== -1 ? cleanText(cols[idx.campaign]) : 'N/A',
      adGroup: idx.adGroup !== -1 ? cleanText(cols[idx.adGroup]) : 'N/A',
      campaignStatus: idx.campaignStatus !== -1 ? cleanText(cols[idx.campaignStatus]) : '',
      adGroupStatus: idx.adGroupStatus !== -1 ? cleanText(cols[idx.adGroupStatus]) : '',
      clicks: idx.clicks !== -1 ? cleanNumber(cols[idx.clicks]) : 0,
      cost: idx.cost !== -1 ? cleanNumber(cols[idx.cost]) : 0,
      impressions: idx.impressions !== -1 ? cleanNumber(cols[idx.impressions]) : 0,
      ctr: idx.ctr !== -1 ? cleanNumber(cols[idx.ctr]) : 0,
      avgCpc: idx.avgCpc !== -1 ? cleanNumber(cols[idx.avgCpc]) : 0,
    });
  }

  return dataRows;
};