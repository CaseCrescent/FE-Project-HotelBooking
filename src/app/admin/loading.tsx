import PageShell, { PageHeader } from "@/components/layout/PageShell";

export default function AdminLoading() {
  return (
    <PageShell wide>
      <PageHeader eyebrow="Admin console" title="Loading…" />
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-4 border border-white/[0.06] bg-white/[0.02]">
            <div className="skeleton skeleton-line w-1/2 mb-2" />
            <div className="skeleton skeleton-line-lg w-3/4" />
          </div>
        ))}
      </section>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="skeleton skeleton-line w-1/3 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.05]">
              <div className="skeleton skeleton-line w-1/2" />
              <div className="skeleton skeleton-line w-16" />
            </div>
          ))}
        </div>
        <div className="glass-card p-6">
          <div className="skeleton skeleton-line w-1/3 mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-3 border-b border-white/[0.05]">
              <div className="skeleton skeleton-line w-1/2 mb-2" />
              <div className="skeleton skeleton-line w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
