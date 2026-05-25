import { useState } from "react";
import { Header } from "@/components/Header.tsx";
import { FormList } from "@/features/graph/components/FormList.tsx";
import { PrefillPanel } from "@/features/prefill/components/PrefillPanel.tsx";

function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Header />

        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <aside className="w-full shrink-0 md:w-1/3">
            <FormList
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />
          </aside>

          <main className="w-full min-w-0 md:w-2/3">
            <PrefillPanel selectedNodeId={selectedNodeId} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
