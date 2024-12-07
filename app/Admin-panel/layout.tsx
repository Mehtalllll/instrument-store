import AdminNavbar from '@/components/Admin-Panel/AdminPanel-Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <AdminNavbar />
      <main>{children}</main>
    </section>
  );
}
