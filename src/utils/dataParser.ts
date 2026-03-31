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

// Helper para ler linhas CSV/TSV corretamente (ignorando delimitadores dentro de aspas)
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

  // 1. Encontrar o Cabeçalho (Header) dinamicamente
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Detectar separador (se tem tab, é TSV, senão assume CSV)
    const currentSep = line.includes('\t') ? '\t' : ',';
    const cols = parseLine(line, currentSep);
    
    // Normaliza para comparação (minúsculas, sem espaços extras)
    const normalizedCols = cols.map(c => c.toLowerCase().trim().replace(/^"|"$/g, ''));
    
    if (normalizedCols.includes('cliques') || normalizedCols.includes('clicks')) {
      headerIndex = i;
      separator = currentSep;
      headers = normalizedCols;
      break;
    }
  }

  if (headerIndex === -1) return [];

  // 2. Mapeamento Estrito de Índices
  const findCol = (aliases: string[]) => {
    return headers.findIndex(h => aliases.includes(h));
  };

  const idx = {
    // Tenta encontrar "Search term", senão cai para "Keyword/Palavra-chave"
    searchTerm: findCol(['search term', 'termo de pesquisa']) !== -1 
      ? findCol(['search term', 'termo de pesquisa']) 
      : findCol(['palavra-chave', 'keyword', 'critério de pesquisa']),
    keyword: findCol(['keyword', 'palavra-chave']),
    matchType: findCol(['criterion type', 'tipo de correspondência', 'tipo de corresp.', 'match type']),
    campaign: findCol(['campaign', 'campanha']),
    adGroup: findCol(['ad group', 'grupo de anúncios']),
    campaignStatus: findCol(['campaign status', 'status da campanha']),
    adGroupStatus: findCol(['ad group status', 'status do grupo de anúncios', 'status']), // 'status' pode ser genérico na web
    clicks: findCol(['clicks', 'cliques']),
    cost: findCol(['cost', 'custo']),
    impressions: findCol(['impressions', 'impressões', 'impr.']),
    ctr: findCol(['ctr', 'taxa de cliques']),
    avgCpc: findCol(['avg cpc', 'cpc médio', 'cpc méd.']),
  };

  // 3. Normalizadores de Texto e Números
  const cleanText = (val: string | undefined): string => {
    if (!val) return '';
    return val.replace(/^"|"$/g, '').trim();
  };

  const cleanNumber = (val: string | undefined): number => {
    if (!val) return 0;
    let cleaned = val.replace(/"/g, '').trim();
    if (cleaned === '--' || cleaned === '') return 0;
    
    // Remove símbolos de moeda, porcentagem e espaços
    cleaned = cleaned.replace(/[R$\s%]/gi, '');
    
    // Logica avançada para casas decimais (1.234,56 vs 1,234.56)
    const match = cleaned.match(/[.,]/g);
    if (match && match.length > 0) {
      const lastPunctuation = match[match.length - 1];
      if (lastPunctuation === ',') {
        // Formato PT-BR: remove os pontos e troca a vírgula por ponto
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        // Formato EN: remove as vírgulas
        cleaned = cleaned.replace(/,/g, '');
      }
    }
    
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // 4. Extração e Filtro de Dados
  const dataRows: AdsRow[] = [];

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || !line.trim()) continue;

    const cols = parseLine(line, separator);
    
    // Ignorar linhas de totais (Google Ads adiciona "Total:" no final do arquivo)
    const lineStr = line.toLowerCase();
    if (lineStr.includes('total:') || lineStr.startsWith('--')) continue;

    // Checagem extra de segurança contra lixo: a linha precisa ter o mínimo de colunas
    if (cols.length <= Math.max(idx.clicks, idx.impressions)) continue;

    // Extrair os termos com fallback seguro
    const searchTermStr = idx.searchTerm !== -1 ? cleanText(cols[idx.searchTerm]) : 'N/A';
    const keywordStr = idx.keyword !== -1 ? cleanText(cols[idx.keyword]) : '';
    const finalTerm = (searchTermStr !== 'N/A' && searchTermStr !== '') ? searchTermStr : keywordStr;

    dataRows.push({
      searchTerm: finalTerm,
      keyword: keywordStr,
      matchType: idx.matchType !== -1 ? cleanText(cols[idx.matchType]) : '',
      campaign: idx.campaign !== -1 ? cleanText(cols[idx.campaign]) : 'N/A', // Web export as vezes omite a campanha
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