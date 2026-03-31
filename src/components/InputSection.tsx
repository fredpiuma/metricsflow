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
        <div className="inline-flex p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
          <FileText size={48} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Ads Keyword Analyzer
        </h1>
        <p className="text-lg text-slate-500 mt-2">
          Cole seus dados TSV ou CSV do Google Ads para gerar um dashboard instantâneo.
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
        <Textarea 
          placeholder="Cole aqui os dados brutos (incluindo cabeçalhos)..."
          className="min-h-[300px] font-mono text-sm bg-slate-50 border-slate-200 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-6 flex justify-center">
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
            disabled={!text.trim()}
            onClick={() => onProcess(text)}
          >
            <Play className="mr-2 h-5 w-5" /> Gerar Dashboard
          </Button>
        </div>
      </div>
      
      <div className="mt-12 text-sm text-slate-400">
        Dica: Você pode copiar as colunas diretamente do Google Ads Editor ou da Web UI.
      </div>
    </div>
  );
};

export default InputSection;