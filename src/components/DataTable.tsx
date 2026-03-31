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

interface DataTableProps {
  data: AdsRow[];
}

const DataTable = ({ data }: DataTableProps) => {
  // Lógica de filtragem:
  // 1. Termos com pelo menos 1 clique
  const withClicks = data.filter(d => d.clicks > 0);
  
  // 2. Top 10 termos sem cliques com maior número de impressões
  const withoutClicks = data
    .filter(d => d.clicks === 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  const displayData = [...withClicks, ...withoutClicks];

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatPercent = (val: number) => `${val.toFixed(2)}%`;

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
              <TableHead className="w-[300px]">Termo de Pesquisa</TableHead>
              <TableHead>Correspondência</TableHead>
              <TableHead className="text-right">Investimento</TableHead>
              <TableHead className="text-right">Impressões</TableHead>
              <TableHead className="text-right">Cliques</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">CPC Médio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, i) => (
              <TableRow key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <TableCell className="font-medium">
                  {row.searchTerm}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-[10px] uppercase">
                    {row.matchType || 'N/A'}
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