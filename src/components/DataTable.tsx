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

type SortKey = 'searchTerm' | 'keyword' | 'matchType' | 'cost' | 'impressions' | 'clicks' | 'ctr' | 'avgCpc' | 'conversions' | 'costPerConversion';

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

  // Exibindo todos os dados
  let displayData = [...data];

  // Aplica a ordenação
  displayData.sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];

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
      setSortDesc(true);
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
        <p className="text-sm text-slate-500">Relatório completo de termos e conversões</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead 
                className="w-[200px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('searchTerm')}
              >
                <div className="flex items-center">
                  Termo
                  {renderSortIcon('searchTerm')}
                </div>
              </TableHead>
              <TableHead 
                className="w-[150px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
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
                  Corresp.
                  {renderSortIcon('matchType')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('impressions')}
              >
                <div className="flex items-center justify-end">
                  Impr.
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
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('conversions')}
              >
                <div className="flex items-center justify-end">
                  Conversões
                  {renderSortIcon('conversions')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('costPerConversion')}
              >
                <div className="flex items-center justify-end">
                  Custo/Conv.
                  {renderSortIcon('costPerConversion')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
                onClick={() => handleSort('cost')}
              >
                <div className="flex items-center justify-end">
                  Custo
                  {renderSortIcon('cost')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, i) => (
              <TableRow key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <TableCell className="font-medium text-xs">
                  {row.searchTerm}
                </TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400 text-xs">
                  {row.keyword || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-[9px] uppercase px-1">
                    {getAbbreviatedMatchType(row.matchType) || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs">{row.impressions.toLocaleString('pt-BR')}</TableCell>
                <TableCell className="text-right text-xs">
                  <span className={row.clicks > 0 ? "font-bold text-blue-600 dark:text-blue-400" : "text-slate-400"}>
                    {row.clicks.toLocaleString('pt-BR')}
                  </span>
                </TableCell>
                <TableCell className="text-right text-xs">{formatPercent(row.ctr)}</TableCell>
                <TableCell className="text-right font-mono text-xs">{formatCurrency(row.avgCpc)}</TableCell>
                <TableCell className="text-right text-xs">
                  <span className={row.conversions > 0 ? "font-bold text-green-600" : "text-slate-400"}>
                    {row.conversions.toLocaleString('pt-BR')}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">{formatCurrency(row.costPerConversion)}</TableCell>
                <TableCell className="text-right font-mono text-xs font-medium">
                  {formatCurrency(row.cost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;