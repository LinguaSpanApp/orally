
import { RecordingDashboard } from "@/components/RecordingDashboard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold italic">O</span>
            </div>
            <span className="font-headline font-bold text-xl tracking-tight text-primary">Oraly</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="hidden sm:inline">Voice Dataset Studio</span>
          </div>
        </div>
      </nav>
      
      <RecordingDashboard />
      
      <footer className="border-t py-6 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Oraly Studio. High-precision voice data collection tool.
          </p>
        </div>
      </footer>
    </main>
  );
}
