import { useState } from 'react';
import { AdsRow } from '@/utils/dataParser';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

interface DataTableProps {
  data: AdsRow[];
}

type SortKey = 'searchTerm' | 'keyword' | 'matchType' | 'cost' | 'impressions' | 'clicks' | 'ctr' | 'avgCpc';

const getAbbreviatedMatchType = (matchType: string): string => {
  if (!matchType) return '';
  const map: Record<string, string> = {
    'AI Max': 'AI Max',
    'Correspondência ampla': 'Ampla',
    'Correspondência de frase': 'Frase',
    'Correspondência exata': 'Exata',
    'Correspondência exata variação': 'Exata variação',
    'Correspondência de frase variação': 'Frase variação',
  };
  return map[matchType] || matchType;
};

const DataTable = ({ data }: DataTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('clicks');
  const [sortDesc, setSortDesc] = useState(true);

  // Lógica de filtragem (mantém a mesma base: com cliques + top 10 sem cliques)
  const withClicks = data.filter(d => d.clicks > 0);
  const withoutClicks = data
    .filter(d => d.clicks === 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  let displayData = [...withClicks, ...withoutClicks];

  // Aplica a ordenação
  displayData.sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

    // Tratamento para strings (ignorar case)
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortDesc ? 1 : -1;
    if (valA > valB) return sortDesc ? -1 : 1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortKey(key);
      setSortDesc(true); // Padrão decrescente ao trocar de coluna
    }
  };

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatPercent = (val: number) => `${val.toFixed(2)}%`;

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-2 h-4 w-4 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />;
    return sortDesc ? <ArrowDown className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" /> : <ArrowUp className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />;
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold">Desempenho Detalhado por Termo</h3>
        <p className="text-sm text-slate-500">Exibindo termos com cliques e top 10 por impressões (sem cliques)</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead 
                className="w-[250px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('searchTerm')}
              >
                <div className="flex items-center">
                  Termo de Pesquisa
                  {renderSortIcon('searchTerm')}
                </div>
              </TableHead>
              <TableHead 
                className="w-[200px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('keyword')}
              >
                <div className="flex items-center">
                  Palavra-chave
                  {renderSortIcon('keyword')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('matchType')}
              >
                <div className="flex items-center">
                  Correspondência
                  {renderSortIcon('matchType')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('cost')}
              >
                <div className="flex items-center justify-end">
                  Investimento
                  {renderSortIcon('cost')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('impressions')}
              >
                <div className="flex items-center justify-end">
                  Impressões
                  {renderSortIcon('impressions')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('clicks')}
              >
                <div className="flex items-center justify-end">
                  Cliques
                  {renderSortIcon('clicks')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('ctr')}
              >
                <div className="flex items-center justify-end">
                  CTR
                  {renderSortIcon('ctr')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('avgCpc')}
              >
                <div className="flex items-center justify-end">
                  CPC Médio
                  {renderSortIcon('avgCpc')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, i) => (
              <TableRow key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <TableCell className="font-medium">
                  {row.searchTerm}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">
                  {row.keyword || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-[10px] uppercase">
                    {getAbbreviatedMatchType(row.matchType) || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">{formatCurrency(row.cost)}</TableCell>
                <TableCell className="text-right text-sm">{row.impressions.toLocaleString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  <span className={row.clicks > 0 ? "font-bold text-blue-600 dark:text-blue-400" : "text-slate-400"}>
                    {row.clicks.toLocaleString('pt-BR')}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm">{formatPercent(row.ctr)}</TableCell>
                <TableCell className="text-right font-mono text-sm">{formatCurrency(row.avgCpc)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;