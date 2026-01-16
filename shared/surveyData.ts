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

export const ACADEMIC_LEVELS = ["أول", "ثاني", "ثالث", "رابع", "امتياز"];

// Get academic levels based on college
export function getAcademicLevelsByCollege(college: string): string[] {
  const collegeToLevels: Record<string, string[]> = {
    "الأسنان": ["أول", "ثاني"],
    "العلوم الطبية والتطبيقية": ["أول", "ثاني", "ثالث"],
    "الطب البشري": ["أول", "ثاني", "ثالث", "رابع", "امتياز"],
    "الطب المخبري": ["أول", "ثاني", "ثالث", "رابع", "امتياز"],
    "الصيدلة السريرية": ["أول", "ثاني", "ثالث", "رابع", "امتياز"],
    "التمريض العالي": ["أول", "ثاني", "ثالث", "رابع", "امتياز"],
    "الهندسة والحاسوب": ["أول", "ثاني", "ثالث", "رابع"],
    "الإدارة الطبية": ["أول", "ثاني", "ثالث", "رابع"],
    "المركز الطبي": ["أول", "ثاني", "ثالث", "رابع"],
  };

  return collegeToLevels[college] || ACADEMIC_LEVELS;
}

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
    section: "الملخصات العلمية",
    text: "مدى دقة المعلومات الواردة في الملخصات",
  },
  {
    id: 6,
    section: "الملخصات العلمية",
    text: "سهولة فهم وترتيب المحتوى في الملخصات",
  },
  {
    id: 7,
    section: "الملخصات العلمية",
    text: "توافق الملخصات مع محتوى المنهج والمحاضرات",
  },
  {
    id: 8,
    section: "الملخصات العلمية",
    text: "مناسبة حجم الملخصات وعدم الإطالة أو الاختصار المخل",
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
    text: "التزام اللجنة بتوفير المواد والملخصات في الوقت المحدد",
  },
  {
    id: 14,
    section: "الأداء العام للجنة العلمية",
    text: "استجابة اللجنة لملاحظات واستفسارات الطلاب",
  },
  {
    id: 15,
    section: "الأداء العام للجنة العلمية",
    text: "التقييم العام لأداء اللجنة العلمية",
  },
];

export const SURVEY_TITLE = "الملتقى الطلابي بجامعة 21 سبتمبر للعلوم الطبية والتطبيقية";
export const COMMITTEE_SUPERVISOR = "محمد الحسني";
export const COMMITTEE_SUPERVISOR_ROLE = "مسؤول اللجنة العلمية";
export const SURVEY_COORDINATOR = "شاهر خالد اليعري";
export const SURVEY_DEVELOPER = "إعداد وتطوير";


export function getAllSections(): string[] {
  const sections = new Set<string>();
  SURVEY_QUESTIONS.forEach((q) => sections.add(q.section));
  return Array.from(sections);
}
