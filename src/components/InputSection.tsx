import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Play } from "lucide-react";

interface InputSectionProps {
  onProcess: (text: string) => void;
}

const InputSection = ({ onProcess }: InputSectionProps) => {
  const [text, setText] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto p-6">
      <div className="w-full text-center mb-8">
        <div className="inline-flex p-4 bg-blue-600 text-white rounded-2xl mb-4 shadow-xl shadow-blue-100">
          <FileText size={48} />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Metrics<span className="text-blue-600">Flow</span>
        </h1>
        <p className="text-lg text-slate-500 mt-4 max-w-lg mx-auto">
          Análise inteligente de dados do Google Ads. Gere dashboards profissionais em segundos.
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
        <Textarea 
          placeholder="Cole aqui os dados brutos do Google Ads (incluindo cabeçalhos)..."
          className="min-h-[300px] font-mono text-sm bg-slate-50 border-slate-200 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-6 flex justify-center">
          <Button 
            size="lg" 
            className="px-10 py-7 text-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-xl"
            disabled={!text.trim()}
            onClick={() => onProcess(text)}
          >
            <Play className="mr-2 h-6 w-6" /> Analisar Dados
          </Button>
        </div>
      </div>
      
      <div className="mt-12 text-sm text-slate-400">
        Compatível com Google Ads Editor e Web UI (CSV/TSV)
      </div>
    </div>
  );
};

export default InputSection;