import Link from 'next/link';
import { dict, getLang } from '@/lib/i18n';

export default async function NotFound() {
  const lang = await getLang();
  const d = dict(lang);
  return (
    <div className="container page prose stack">
      <h1>{d.notFound.title}</h1>
      <p className="muted">{d.notFound.lead}</p>
      <p>
        <Link className="btn btn--primary" href="/">
          {d.notFound.cta}
        </Link>
      </p>
    </div>
  );
}
