import React, { useRef, useState } from 'react';
import type { AnatomyViewerProps, AnatomyPart } from '../../../types/anatomy';

const AnatomyViewer: React.FC<AnatomyViewerProps> = ({ parts, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const handlePartEnter = (partName: string) => {
    setHoveredPart(partName);

    const elements = containerRef.current?.querySelectorAll(`[data-spar-part="${partName}"]`);

    elements?.forEach((el: Element) => {
      el.classList.add('spar-anatomy-highlight');
    });
  };

  const handlePartLeave = () => {
    setHoveredPart(null);

    const elements = containerRef.current?.querySelectorAll('.spar-anatomy-highlight');

    elements?.forEach((el: Element) => {
      el.classList.remove('spar-anatomy-highlight');
    });
  };

  return (
    <div className='anatomy-viewer-wrapper'>
      <div className='anatomy-demo' ref={containerRef}>
        {children}
      </div>

      <div className='anatomy-parts'>
        <div className='part-header'>Parts</div>
        {parts.map((part: AnatomyPart) => (
          <div
            key={part.name}
            className={`part-item ${hoveredPart === part.name ? 'active' : ''}`}
            onMouseEnter={() => handlePartEnter(part.name)}
            onMouseLeave={handlePartLeave}
          >
            <span className='part-label'>{part.label}</span>
            {part.description && <span className='part-description'>{part.description}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnatomyViewer;
