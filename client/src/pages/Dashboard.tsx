import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  SURVEY_QUESTIONS,
  getAllSections,
  COLLEGES,
} from "@shared/surveyData";
import { Loader2 } from "lucide-react";

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

export default function Dashboard() {
  const { data: analyticsData, isLoading } = trpc.survey.getAnalytics.useQuery();
  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    if (!analyticsData) return;

    const responses = analyticsData.totalResponses as SurveyResponse[];
    const answers = analyticsData.answers as SurveyAnswer[];

    // Calculate average ratings per question
    const questionAverages: Record<number, { avg: number; count: number }> = {};
    answers.forEach((answer) => {
      if (!questionAverages[answer.questionId]) {
        questionAverages[answer.questionId] = { avg: 0, count: 0 };
      }
      questionAverages[answer.questionId].avg += answer.rating;
      questionAverages[answer.questionId].count += 1;
    });

    // Calculate final averages
    const questionChartData = SURVEY_QUESTIONS.map((q) => {
      const data = questionAverages[q.id];
      return {
        name: `Q${q.id}`,
        average: data ? parseFloat((data.avg / data.count).toFixed(2)) : 0,
        question: q.text.substring(0, 30),
      };
    });

    // College distribution
    const collegeDistribution: Record<string, number> = {};
    responses.forEach((r) => {
      collegeDistribution[r.college] =
        (collegeDistribution[r.college] || 0) + 1;
    });

    const collegeChartData = Object.entries(collegeDistribution).map(
      ([college, count]) => ({
        name: college,
        value: count,
      })
    );

    // Academic level distribution
    const levelDistribution: Record<string, number> = {};
    responses.forEach((r) => {
      levelDistribution[r.academicLevel] =
        (levelDistribution[r.academicLevel] || 0) + 1;
    });

    const levelChartData = Object.entries(levelDistribution).map(
      ([level, count]) => ({
        name: level,
        count: count,
      })
    );

    // Section averages
    const sectionAverages: Record<string, { sum: number; count: number }> = {};
    getAllSections().forEach((section) => {
      sectionAverages[section] = { sum: 0, count: 0 };
    });

    SURVEY_QUESTIONS.forEach((q) => {
      const data = questionAverages[q.id];
      if (data) {
        sectionAverages[q.section].sum += data.avg;
        sectionAverages[q.section].count += data.count;
      }
    });

    const sectionChartData = getAllSections().map((section) => {
      const data = sectionAverages[section];
      return {
        name: section,
        average: data.count > 0 ? parseFloat((data.sum / data.count).toFixed(2)) : 0,
      };
    });

    setChartData({
      questionChartData,
      collegeChartData,
      levelChartData,
      sectionChartData,
      totalResponses: responses.length,
      totalAnswers: answers.length,
    });
  }, [analyticsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
    "#6366f1",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            لوحة التحكم التحليلية
          </h1>
          <p className="text-gray-600">
            تقارير شاملة عن استبيانات تقييم اللجنة العلمية
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white shadow">
            <div className="text-gray-600 text-sm font-medium mb-2">
              إجمالي الاستبيانات
            </div>
            <div className="text-4xl font-bold text-blue-600">
              {chartData.totalResponses || 0}
            </div>
          </Card>

          <Card className="p-6 bg-white shadow">
            <div className="text-gray-600 text-sm font-medium mb-2">
              إجمالي الإجابات
            </div>
            <div className="text-4xl font-bold text-green-600">
              {chartData.totalAnswers || 0}
            </div>
          </Card>

          <Card className="p-6 bg-white shadow">
            <div className="text-gray-600 text-sm font-medium mb-2">
              متوسط التقييم العام
            </div>
            <div className="text-4xl font-bold text-yellow-600">
              {chartData.sectionChartData
                ? (
                    chartData.sectionChartData.reduce(
                      (sum: number, s: any) => sum + s.average,
                      0
                    ) / chartData.sectionChartData.length
                  ).toFixed(2)
                : "0.00"}
            </div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Question Averages */}
          <Card className="p-6 bg-white shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              متوسط التقييمات حسب السؤال
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.questionChartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="average" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Section Averages */}
          <Card className="p-6 bg-white shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              متوسط التقييمات حسب القسم
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.sectionChartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="average" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* College Distribution */}
          <Card className="p-6 bg-white shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              توزيع الطلاب حسب الكلية
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.collegeChartData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(chartData.collegeChartData || []).map(
                    (_entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Academic Level Distribution */}
          <Card className="p-6 bg-white shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              توزيع الطلاب حسب المستوى الدراسي
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.levelChartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed Responses Table */}
        <Card className="p-6 bg-white shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            جميع الاستبيانات المرسلة
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">
                    الاسم
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">
                    الكلية
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">
                    التخصص
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">
                    المستوى
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.totalResponses &&
                Array.isArray(analyticsData.totalResponses) ? (
                  (analyticsData.totalResponses as SurveyResponse[]).map(
                    (response, index) => (
                      <tr
                        key={response.id}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-4 py-3 text-gray-900">
                          {response.fullName}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {response.college}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {response.specialization}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {response.academicLevel}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {new Date(response.submittedAt).toLocaleDateString(
                            "ar-SA"
                          )}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                      لا توجد بيانات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Suggestions Section */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded"></span>
            اقتراحات وملاحظات الطلاب
          </h2>
          <div className="space-y-4">
            {analyticsData?.totalResponses &&
            Array.isArray(analyticsData.totalResponses) ? (
              (analyticsData.totalResponses as SurveyResponse[])
                .filter((response) => response.suggestions && response.suggestions.trim())
                .map((response, index) => (
                  <div
                    key={response.id}
                    className="bg-white border-l-4 border-blue-600 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">الاسم</p>
                        <p className="text-gray-900 font-semibold">{response.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">الكلية</p>
                        <p className="text-gray-900 font-semibold">{response.college}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">التخصص</p>
                        <p className="text-gray-900 font-semibold">{response.specialization}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">المستوى</p>
                        <p className="text-gray-900 font-semibold">{response.academicLevel}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">الاقتراح</p>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded">
                        {response.suggestions}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      التاريخ: {new Date(response.submittedAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">لا توجد اقتراحات حتى الآن</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">
            استبيان تقييم اللجنة العلمية - الملتقى الطلابي بجامعة 21 سبتمبر للعلوم الطبية والتطبيقية
          </p>
          <p className="text-gray-400 text-sm">
            تحت إشراف: محمد الحسني - مسؤول اللجنة العلمية
          </p>
          <p className="text-gray-400 text-sm mt-2">
            تطوير: شاهر خالد اليعري
          </p>
        </div>
      </footer>
    </div>
  );
}
