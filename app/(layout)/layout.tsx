import Navbar from '@/components/Global/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Navbar />
      <main>{children}</main>
    </section>
  );
}
