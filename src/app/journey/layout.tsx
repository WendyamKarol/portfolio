export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="dark min-h-[100dvh] bg-slate-950">{children}</div>;
}
