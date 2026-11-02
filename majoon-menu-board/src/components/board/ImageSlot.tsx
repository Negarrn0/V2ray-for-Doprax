import { useRef } from 'react';
import { KhatamStar } from './Ornaments';
import { fileToOptimizedDataUrl } from '../../lib/image';

interface Props {
  image: string | null;
  focusX: number;
  focusY: number;
  showMotif: boolean;
  showLabel: boolean;
  editable: boolean;
  motifSize: number;
  className?: string;
  style?: React.CSSProperties;
  onImage?: (dataUrl: string) => void;
}

/**
 * Persian-arch photo frame. Empty → a quiet tonal arch with an inset hairline and khatam star.
 * In the editor, clicking the frame uploads / replaces the photograph.
 */
export function ImageSlot({ image, focusX, focusY, showMotif, showLabel, editable, motifSize, className = '', style, onImage }: Props) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`mj-arch ${image ? 'has-image' : 'is-empty'} ${className}`}
      style={style}
      onClick={
        editable
          ? (e) => {
              e.stopPropagation();
              input.current?.click();
            }
          : undefined
      }
    >
      {image ? (
        <img src={image} alt="" className="mj-arch-photo" style={{ objectPosition: `${focusX}% ${focusY}%` }} draggable={false} />
      ) : (
        showMotif && (
          <div className="mj-arch-motif">
            <KhatamStar size={motifSize} stroke={1.6} />
          </div>
        )
      )}
      <span className="mj-arch-inset" />
      {!image && showLabel && <span className="mj-slot-label mj-arch-label">Product photograph</span>}
      {editable && (
        <>
          <span className="mj-arch-hover edit-only">{image ? 'Replace photo' : 'Upload photo'}</span>
          <input
            ref={input}
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file && onImage) onImage(await fileToOptimizedDataUrl(file));
            }}
          />
        </>
      )}
    </div>
  );
}
