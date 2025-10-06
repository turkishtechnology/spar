export interface AnatomyPart {
  name: string;
  label: string;
  description?: string;
}

export interface AnatomyViewerProps {
  parts: AnatomyPart[];
  children: React.ReactNode;
}
