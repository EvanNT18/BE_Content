import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/events">Events</Link></li>
        </ul>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
