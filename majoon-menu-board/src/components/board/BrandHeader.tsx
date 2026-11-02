import type { Brand } from '../../types';
import { StarRule } from './Ornaments';

export function BrandHeader({ brand }: { brand: Brand }) {
  return (
    <header className="mj-header">
      <div className="mj-header-row">
        <div className="mj-brand-block">
          <h1 className="mj-wordmark">{brand.name}</h1>
          {brand.tagline && <p className="mj-tagline">{brand.tagline}</p>}
        </div>
        <div className="mj-brand-aside">
          {brand.nativeName && (
            <p className="mj-native" lang="fa" dir="rtl">
              {brand.nativeName}
            </p>
          )}
          {brand.descriptor && <p className="mj-descriptor">{brand.descriptor}</p>}
        </div>
      </div>
      <StarRule starSize={46} />
    </header>
  );
}
