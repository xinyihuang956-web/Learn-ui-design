// Unified course thumbnail images, keyed by course code.
// Both Dashboard mini cards and MyCourses full cards pull from here.
export const COURSE_IMAGES: Record<string, string> = {
  'BIOL08019': 'https://picsum.photos/seed/microscope42/800/320',
  'SOCI08024': 'https://picsum.photos/seed/lectureroom/800/320',
  'SOCI08001': 'https://picsum.photos/seed/lectureroom/800/320',
  'MKTG08012': 'https://picsum.photos/seed/businessoffice/800/320',
  'MGTS08018': 'https://picsum.photos/seed/businessoffice/800/320',
  'HIST08031': 'https://picsum.photos/seed/castlestone/800/320',
  'HIST08007': 'https://picsum.photos/seed/castlestone/800/320',
  'DESI08009': 'https://picsum.photos/seed/digitalstudio/800/320',
  'INFR08020': 'https://picsum.photos/seed/digitalstudio/800/320',
  'DATA08006': 'https://picsum.photos/seed/codescreen/800/320',
  'DSCI08012': 'https://picsum.photos/seed/codescreen/800/320',
}

export function getCourseImage(code: string): string {
  return COURSE_IMAGES[code] ?? 'https://picsum.photos/seed/university99/800/320'
}
