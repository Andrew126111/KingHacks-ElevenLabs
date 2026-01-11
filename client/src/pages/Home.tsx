import { useState } from "react";
import { useAnalyzeContract } from "@/hooks/use-analyze";
import { ResultCard } from "@/components/ResultCard";
import { useToast } from "@/hooks/use-toast";
import { HighlightText } from "@/components/HighlightText";
import { Scale, LogOut, CreditCard, UserX, ArrowRight, Loader2, FileText, Eye, Edit2 } from "lucide-react";

export default function Home() {
  const [contractText, setContractText] = useState("");
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const { toast } = useToast();
  
  const { mutate, isPending, data, reset } = useAnalyzeContract();

  const handleAnalyze = (scenario: string) => {
    if (!contractText.trim()) {
      toast({
        title: "Contract text required",
        description: "Please paste your contract text before selecting a scenario.",
        variant: "destructive",
      });
      return;
    }
    
    setActiveScenario(scenario);
    setIsViewMode(true);
    mutate({ contractText, scenario });
  };

  const handleReset = () => {
    reset();
    setActiveScenario(null);
    setContractText("");
    setIsViewMode(false);
  };

  const isAnalyzing = isPending;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-primary/20">
      {/* Decorative background element */}
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>

      <header className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-slate-200/60 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-white p-2.5 rounded-lg shadow-lg shadow-primary/20">
            <Scale size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-primary">
              ClauseCast
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Legal Interpretation Engine
            </p>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Results View */}
        {data && activeScenario ? (
          <div className="space-y-12">
            <div className="bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                   <Eye size={16} />
                   <span>Contract Review (Highlighting Relevant Clauses)</span>
                 </div>
                 <button 
                  onClick={() => setIsViewMode(false)}
                  className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                 >
                   <Edit2 size={12} />
                   Edit Original
                 </button>
              </div>
              <div className="p-6 h-64 overflow-y-auto text-base md:text-lg leading-relaxed font-serif whitespace-pre-wrap">
                <HighlightText text={contractText} snippets={data.highlightSnippets || []} />
              </div>
            </div>

            <ResultCard 
              data={data} 
              scenario={activeScenario} 
              onReset={handleReset} 
            />
          </div>
        ) : (
          /* Input View */
          <div className={`space-y-12 transition-opacity duration-500 ${isAnalyzing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">
                Hear the consequences <br />
                <span className="text-slate-500 italic font-serif font-normal">of breaking a contract.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Paste your legal agreement below and select a scenario to hear a plain-English explanation of your risks.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                   <FileText size={16} />
                   <span>Contract Input</span>
                 </div>
                 <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Step 1</span>
              </div>
              <textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste the full text of your contract here (e.g., Employment Agreement, Lease, Service Contract)..."
                className="w-full h-64 p-6 resize-none focus:outline-none focus:bg-slate-50/30 transition-colors text-base md:text-lg leading-relaxed placeholder:text-slate-300 font-serif"
                disabled={isAnalyzing}
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <span className="h-px bg-slate-200 flex-1"></span>
                 <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Step 2: Choose a Scenario</span>
                 <span className="h-px bg-slate-200 flex-1"></span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                <button
                  onClick={() => handleAnalyze('quit')}
                  disabled={isAnalyzing}
                  className="btn-scenario bg-white text-slate-700 hover:text-primary group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <LogOut size={32} strokeWidth={1.5} className="mb-2 text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="relative">If I quit early</span>
                  <span className="text-xs font-sans text-muted-foreground relative group-hover:text-primary/70">Resignation clauses</span>
                </button>

                <button
                  onClick={() => handleAnalyze('payment')}
                  disabled={isAnalyzing}
                  className="btn-scenario bg-white text-slate-700 hover:text-primary group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CreditCard size={32} strokeWidth={1.5} className="mb-2 text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="relative">If I miss payment</span>
                  <span className="text-xs font-sans text-muted-foreground relative group-hover:text-primary/70">Default & Penalties</span>
                </button>

                <button
                  onClick={() => handleAnalyze('terminate')}
                  disabled={isAnalyzing}
                  className="btn-scenario bg-white text-slate-700 hover:text-primary group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <UserX size={32} strokeWidth={1.5} className="mb-2 text-slate-400 group-hover:text-primary transition-colors" />
                  <span className="relative">If they fire me</span>
                  <span className="text-xs font-sans text-muted-foreground relative group-hover:text-primary/70">Termination Rights</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full text-center space-y-6">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Scale className="absolute inset-0 m-auto text-primary" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-primary mb-2">Analyzing Contract</h3>
              <p className="text-muted-foreground text-sm">
                Our AI is reviewing the clauses for your selected scenario...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
