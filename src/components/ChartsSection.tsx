import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { AdsRow } from '@/utils/dataParser';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ChartsSectionProps {
  data: AdsRow[];
}

const COLORS = ['#1a73e8', '#34a853', '#fbbc05', '#ea4335', '#8e24aa', '#00acc1', '#fb8c00', '#546e7a', '#d81b60', '#7cb342'];

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

// Removido o parâmetro maxLength e o truncamento
const formatLabel = (term: string, matchType: string) => {
  const abbr = getAbbreviatedMatchType(matchType);
  return abbr ? `${term} (${abbr})` : term;
};

const ChartsSection = ({ data }: ChartsSectionProps) => {
  // Top 5 Investimentos
  const topCost = [...data]
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5)
    .map(d => ({
      name: formatLabel(d.searchTerm, d.matchType),
      valor: d.cost
    }));

  // Distribuição de Cliques (Top 10 + Outros)
  const sortedByClicks = [...data].sort((a, b) => b.clicks - a.clicks);
  const topClicks = sortedByClicks.slice(0, 10);
  const othersClicks = sortedByClicks.slice(10).reduce((sum, d) => sum + d.clicks, 0);
  
  const clickDistribution = topClicks.map(d => ({
    name: formatLabel(d.searchTerm, d.matchType),
    value: d.clicks
  }));

  if (othersClicks > 0) {
    clickDistribution.push({ name: 'Outros', value: othersClicks });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top 5 Termos por Investimento (R$)</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCost} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              {/* Aumentado o width do YAxis para acomodar textos mais longos */}
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={200} />
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="valor" fill="#1a73e8" radius={[0, 4, 4, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Distribuição de Cliques</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={clickDistribution}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {clickDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;