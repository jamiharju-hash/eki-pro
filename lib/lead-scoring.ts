export type LeadScoringInput = {
  area: string;
  projectType: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline?: string | null;
};

const priorityAreas = ['nummela', 'vihti', 'lohja', 'kirkkonummi', 'espoo', 'helsinki'];
const highMarginTypes = ['kylpyhuone', 'märkätila', 'markatila', 'sauna', 'täyssaneeraus', 'tayssaneeraus', 'huoneistoremontti'];

export function scoreLead(input: LeadScoringInput) {
  const area = input.area.toLowerCase();
  const projectType = input.projectType.toLowerCase();
  const budgetMax = Number(input.budgetMax ?? input.budgetMin ?? 0);
  const timeline = (input.timeline ?? '').toLowerCase();

  let score = 20;

  if (priorityAreas.some((item) => area.includes(item))) score += 20;
  if (highMarginTypes.some((item) => projectType.includes(item))) score += 25;
  if (budgetMax >= 15000) score += 25;
  else if (budgetMax >= 8000) score += 15;
  else if (budgetMax >= 3000) score += 8;

  if (timeline.includes('heti') || timeline.includes('1-2')) score += 5;
  if (timeline.includes('3') || timeline.includes('kuukaus')) score += 10;
  if (timeline.includes('ei kiire')) score += 5;

  const goldenJob =
    budgetMax >= 15000 &&
    priorityAreas.some((item) => area.includes(item)) &&
    highMarginTypes.some((item) => projectType.includes(item));

  return {
    score: Math.min(score, 100),
    goldenJob,
  };
}
