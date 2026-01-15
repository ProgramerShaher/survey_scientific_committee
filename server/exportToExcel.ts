import * as XLSX from 'xlsx';

interface SurveyResponse {
  id: number;
  fullName: string;
  college: string;
  specialization: string;
  academicLevel: string;
  suggestions: string | null;
  submittedAt: Date;
  createdAt: Date;
}

interface SurveyAnswer {
  id: number;
  responseId: number;
  questionId: number;
  rating: number;
  createdAt: Date;
}

interface QuestionData {
  id: number;
  text: string;
  section: string;
}

export function generateExcelFile(
  responses: SurveyResponse[],
  answers: SurveyAnswer[],
  questions: QuestionData[]
): Buffer {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Summary
  const summaryData: (string | number)[][] = [
    ['ملخص الاستبيان'],
    [''],
    ['إجمالي الاستبيانات المرسلة', responses.length],
    ['إجمالي الإجابات', answers.length],
    [''],
    ['تاريخ التقرير', new Date().toLocaleDateString('ar-SA')],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'ملخص');

  // Sheet 2: Responses
  const responseHeaders: string[] = [
    'الاسم الرباعي',
    'الكلية',
    'التخصص',
    'المستوى الدراسي',
    'المقترحات',
    'تاريخ الإرسال',
  ];

  const responseData: (string | number)[][] = responses.map((r) => [
    r.fullName,
    r.college,
    r.specialization,
    r.academicLevel,
    r.suggestions || '',
    new Date(r.submittedAt).toLocaleDateString('ar-SA'),
  ]);

  const responsesSheet = XLSX.utils.aoa_to_sheet([
    responseHeaders,
    ...responseData,
  ]);
  responsesSheet['!cols'] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 40 },
    { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(workbook, responsesSheet, 'الاستبيانات');

  // Sheet 3: Ratings by Question
  const ratingHeaders: string[] = [
    'رقم السؤال',
    'نص السؤال',
    'القسم',
    ...Array.from({ length: 5 }, (_, i) => `${i + 1} نجوم`),
  ];

  const ratingData: (string | number)[][] = questions.map((q) => {
    const questionAnswers = answers.filter((a) => a.questionId === q.id);
    const ratingCounts: number[] = [0, 0, 0, 0, 0];

    questionAnswers.forEach((a) => {
      if (a.rating >= 1 && a.rating <= 5) {
        ratingCounts[a.rating - 1]++;
      }
    });

    return [String(q.id), q.text, q.section, ...ratingCounts];
  });

  const ratingsSheet = XLSX.utils.aoa_to_sheet([
    ratingHeaders,
    ...ratingData,
  ]);
  ratingsSheet['!cols'] = [
    { wch: 12 },
    { wch: 40 },
    { wch: 25 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(workbook, ratingsSheet, 'التقييمات');

  // Sheet 4: Statistics
  const statsData: (string | number)[][] = [
    ['إحصائيات التقييمات'],
    [''],
    ['السؤال', 'متوسط التقييم', 'عدد الإجابات'],
  ];

  questions.forEach((q) => {
    const questionAnswers = answers.filter((a) => a.questionId === q.id);
    const average =
      questionAnswers.length > 0
        ? (
            questionAnswers.reduce((sum, a) => sum + a.rating, 0) /
            questionAnswers.length
          ).toFixed(2)
        : '0';

    statsData.push([q.text, average, questionAnswers.length]);
  });

  const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
  statsSheet['!cols'] = [{ wch: 40 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(workbook, statsSheet, 'الإحصائيات');

  // Generate buffer
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return Buffer.from(buffer as ArrayBuffer);
}
