export function generateStaticParams() {
  return [
    { tool: [] }, // /studio
    { tool: ['structure'] }, // /studio/structure
    { tool: ['structure', 'banner'] }, // /studio/structure/banner
  ];
} 