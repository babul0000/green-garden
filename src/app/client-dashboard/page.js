export default function ClientDashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background text-foreground px-6 py-12">
      <div className="max-w-md w-full bg-white border border-foreground/5 rounded-3xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center text-3xl mx-auto mb-6">
          📊
        </div>
        <h1 className="text-3xl font-serif font-bold text-primary-green mb-4">Client Dashboard</h1>
        <p className="text-sm text-foreground/75 leading-relaxed mb-8">
          Check your active projects, timeline metrics, photo milestones, and payment histories.
        </p>
        <a 
          href="/" 
          className="inline-block bg-primary-green hover:bg-primary-green-dark text-white text-[14px] font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          Back to Homepage
        </a>
      </div>
    </div>
  );
}
