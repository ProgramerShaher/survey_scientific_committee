/**
 * Survey Data - Static configuration for colleges, specializations, and questions
 */

export const COLLEGES = [
  "الطب البشري",
  "الصيدلة السريرية",
  "الطب المخبري",
  "التمريض العالي",
  "الهندسة والحاسوب",
  "العلوم الطبية والتطبيقية",
  "الإدارة الطبية",
  "المركز الطبي",
  "الأسنان",
];

export const SPECIALIZATIONS: Record<string, string[]> = {
  "الطب البشري": ["طب عام"],
  "الصيدلة السريرية": ["صيدلة سريرية"],
  "الطب المخبري": ["مخبري"],
  "التمريض العالي": ["تمريض"],
  "الهندسة والحاسوب": [
    "تكنولوجيا معلومات",
    "هندسة طبية",
    "أمن سيبراني",
    "ذكاء اصطناعي",
  ],
  "العلوم الطبية والتطبيقية": [
    "التخدير",
    "الرعاية التنفسية",
    "الأشعة",
    "العمليات",
  ],
  "الإدارة الطبية": ["إدارة عامة", "محاسبة"],
  "المركز الطبي": ["خدمات طبية"],
  "الأسنان": ["طب الأسنان"],
};

export const ACADEMIC_LEVELS = ["أول", "ثاني", "ثالث", "رابع"];

export interface SurveyQuestion {
  id: number;
  text: string;
  section: string;
}

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // Section 1: Audio Recording Quality (4 questions)
  {
    id: 1,
    section: "جودة التسجيلات الصوتية",
    text: "جودة الصوت في التسجيل",
  },
  {
    id: 2,
    section: "جودة التسجيلات الصوتية",
    text: "وضوح صوت المحاضر أو المختص",
  },
  {
    id: 3,
    section: "جودة التسجيلات الصوتية",
    text: "خلو التسجيل من الضوضاء والمقاطعات",
  },
  {
    id: 4,
    section: "جودة التسجيلات الصوتية",
    text: "تغطية التسجيل لجميع أجزاء المحاضرة أو المختص",
  },

  // Section 2: Scientific Summaries (4 questions)
  {
    id: 5,
    section: "التصخلمات العلمية",
    text: "مدى دقة المعلومات الواردة في التصخلمات",
  },
  {
    id: 6,
    section: "التصخلمات العلمية",
    text: "سهولة فهم وترتيب المحتوى في التصخلمات",
  },
  {
    id: 7,
    section: "التصخلمات العلمية",
    text: "توافق التصخلمات مع محتوى المنهج والمحاضرات",
  },
  {
    id: 8,
    section: "التصخلمات العلمية",
    text: "مناسبة حجم التصخلمات وعدم الإطالة أو الاختصار المخل",
  },

  // Section 3: Question Models (4 questions)
  {
    id: 9,
    section: "نماذج الأسئلة",
    text: "تنوع نماذج الأسئلة وشمولها للمقرر",
  },
  {
    id: 10,
    section: "نماذج الأسئلة",
    text: "وضوح صياغة الأسئلة",
  },
  {
    id: 11,
    section: "نماذج الأسئلة",
    text: "فائدة النماذج في الاستعداد للاختبارات",
  },
  {
    id: 12,
    section: "نماذج الأسئلة",
    text: "مدى توافق النماذج مع طبيعة أسئلة الاختبارات الفعلية",
  },

  // Section 4: Overall Committee Performance (3 questions)
  {
    id: 13,
    section: "الأداء العام للجنة العلمية",
    text: "التزام اللجنة بتوفير المواد والتصخلمات في الوقت المحدد",
  },
  {
    id: 14,
    section: "الأداء العام للجنة العلمية",
    text: "تفاعل اللجنة مع الملاحظات والاستفسارات",
  },
  {
    id: 15,
    section: "الأداء العام للجنة العلمية",
    text: "الرضا العام عن أداء اللجنة العلمية",
  },
];

export function getQuestionsBySection(section: string): SurveyQuestion[] {
  return SURVEY_QUESTIONS.filter((q) => q.section === section);
}

export function getAllSections(): string[] {
  const sections = new Set(SURVEY_QUESTIONS.map((q) => q.section));
  return Array.from(sections);
}
