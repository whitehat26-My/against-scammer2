import { OFFICIAL_CHANNELS } from '@/lib/official';
import type { Lang } from '@/lib/i18n';
import { ExternalLink } from './ui';

export function OfficialChannelList({ lang }: { lang: Lang }) {
  return (
    <div className="grid grid--2">
      {OFFICIAL_CHANNELS.map((channel) => (
        <div key={channel.id} className="panel kilau">
          <h3 className="card__title">{lang === 'ms' ? channel.nama : channel.name}</h3>
          <p className="small muted">{lang === 'ms' ? channel.keterangan_ms : channel.keterangan_en}</p>
          <div className="btnrow">
            {channel.telefon ? (
              <a className="btn btn--secondary" href={`tel:${channel.telefon.replace(/[^\d+]/g, '')}`}>
                {channel.telefon}
              </a>
            ) : null}
            {channel.url ? (
              <ExternalLink href={channel.url} className="btn btn--secondary">
                {new URL(channel.url).hostname}
              </ExternalLink>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
