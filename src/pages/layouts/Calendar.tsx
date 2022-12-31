export function CalendarLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col items-center justify-center">
      <section>{children}</section>
    </main>
  );
}
