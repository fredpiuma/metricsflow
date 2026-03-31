"use client";

import React, { useState, useMemo } from 'react';
import { AdsRow, parseAdsData } from '@/utils/dataParser';
import InputSection from '@/components/InputSection';
import KpiCard from '@/components/KpiCard';
import ChartsSection from '@/components/ChartsSection';
import DataTable from '@/components/DataTable';
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  BarChart3, 
  MousePointer2, 
  Target, 
  Zap,
  RefreshCw,
  LayoutDashboard
} from "lucide-react";
import { showSuccess } from '@/utils/toast';

const Index = () => {
  const [data, setData] = useState<AdsRow[]>([]);
  const [hasData, setHasData] = useState(false);

  const handleProcess = (text: string) => {
    const parsed = parseAdsData(text);
    if (parsed.length > 0) {
      setData(parsed);
      setHasData(true);
      showSuccess("Relatório processado com sucesso!");
    }
  };

  const handleReset = () => {
    setData([]);
    setHasData(false);
  };

  const kpis = useMemo(() => {
    if (data.length === 0) return null;
    
    const totalCost = data.reduce((sum, d) => sum + d.cost, 0);
    const totalImpressions = data.reduce((sum, d) => sum + d.impressions, 0);
    const totalClicks = data.reduce((sum, d) => sum + d.clicks, 0);
    const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgCpc = totalClicks > 0 ? totalCost / totalClicks : 0;

    return {
      totalCost,
      totalImpressions,
      totalClicks,
      avgCtr,
      avgCpc
    };
  }, [data]);

  const headerInfo = useMemo(() => {
    if (data.length === 0) return null;
    return {
      campaign: data[0].campaign,
      adGroup: data[0].adGroup,
      campaignStatus: data[0].campaignStatus,
      adGroupStatus: data[0].adGroupStatus
    };
  }, [data]);

  if (!hasData) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <InputSection onProcess={handleProcess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 leading-none">Dashboard de Palavras-Chave</h2>
              <p className="text-xs text-slate-500 mt-1">Análise de Desempenho Google Ads</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="text-slate-600">
            <RefreshCw size={14} className="mr-2" /> Novo Relatório
          </Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Campaign Identification */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8 flex flex-wrap gap-x-12 gap-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Campanha</span>
            <p className="text-lg font-semibold text-slate-800">{headerInfo?.campaign || 'N/A'}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Grupo de Anúncios</span>
            <p className="text-lg font-semibold text-slate-800">{headerInfo?.adGroup || 'N/A'}</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Campanha</span>
              <div className="mt-1 flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${headerInfo?.campaignStatus === 'Enabled' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <span className="text-sm font-medium">{headerInfo?.campaignStatus || 'N/A'}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Grupo</span>
              <div className="mt-1 flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${headerInfo?.adGroupStatus === 'Enabled' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <span className="text-sm font-medium">{headerInfo?.adGroupStatus || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard 
              label="Investimento Total" 
              value={kpis.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
              icon={<DollarSign size={20} />} 
            />
            <KpiCard 
              label="Impressões" 
              value={kpis.totalImpressions.toLocaleString('pt-BR')} 
              icon={<BarChart3 size={20} />} 
            />
            <KpiCard 
              label="Cliques" 
              value={kpis.totalClicks.toLocaleString('pt-BR')} 
              icon={<MousePointer2 size={20} />} 
            />
            <KpiCard 
              label="CTR Médio" 
              value={`${kpis.avgCtr.toFixed(2)}%`} 
              icon={<Target size={20} />} 
            />
            <KpiCard 
              label="CPC Médio" 
              value={kpis.avgCpc.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
              icon={<Zap size={20} />} 
            />
          </div>
        )}

        {/* Visualizations */}
        <ChartsSection data={data} />

        {/* Detailed Table */}
        <DataTable data={data} />
      </main>
    </div>
  );
};

export default Index;