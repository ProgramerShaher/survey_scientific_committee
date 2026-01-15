import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  COLLEGES,
  SPECIALIZATIONS,
  ACADEMIC_LEVELS,
  SURVEY_QUESTIONS,
  getAllSections,
  SURVEY_TITLE,
  COMMITTEE_SUPERVISOR,
  COMMITTEE_SUPERVISOR_ROLE,
} from "@shared/surveyData";
import { Star, CheckCircle2 } from "lucide-react";

const SURVEY_DEVELOPER = "إعداد وتطوير";
const SURVEY_COORDINATOR = "شاهر خالد اليعري";

function Survey() {
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.survey.submit.useMutation();

  const handleCollegeChange = (value: string) => {
    setCollege(value);
    setSpecialization("");
  };

  const handleRating = (questionId: number, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      toast.error("الرجاء إدخال الاسم الرباعي", { duration: 4000 });
      return;
    }
    if (!college) {
      toast.error("الرجاء اختيار الكلية", { duration: 4000 });
      return;
    }
    if (!specialization) {
      toast.error("الرجاء اختيار التخصص", { duration: 4000 });
      return;
    }
    if (!academicLevel) {
      toast.error("الرجاء اختيار المستوى الدراسي", { duration: 4000 });
      return;
    }

    if (Object.keys(ratings).length !== SURVEY_QUESTIONS.length) {
      toast.error("الرجاء تقييم جميع الأسئلة", { duration: 4000 });
      return;
    }

    setIsSubmitting(true);

    try {
      const answers = SURVEY_QUESTIONS.map((q) => ({
        questionId: q.id,
        rating: ratings[q.id],
      }));

      await submitMutation.mutateAsync({
        fullName,
        college,
        specialization,
        academicLevel,
        suggestions: suggestions.trim() || undefined,
        answers,
      });

      setSubmitted(true);
      toast.success("تم إرسال الاستبيان بنجاح", { duration: 4000 });

      setTimeout(() => {
        setFullName("");
        setCollege("");
        setSpecialization("");
        setAcademicLevel("");
        setSuggestions("");
        setRatings({});
        setSubmitted(false);
      }, 4000);
    } catch (error) {
      toast.error("حدث خطأ في إرسال الاستبيان", { duration: 4000 });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-12 text-center shadow-2xl bg-white rounded-2xl">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            شكراً لتقييمك
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 border border-blue-200">
            <p className="text-xl text-gray-800 font-semibold mb-3">
              تم إرسال البيانات إلى:
            </p>
            <p className="text-lg text-blue-700 font-bold mb-2">
              ✓ شاهر خالد اليعري
            </p>
            <p className="text-lg text-indigo-700 font-bold">
              ✓ محمد الحسني
            </p>
          </div>
          <p className="text-gray-600 text-lg mb-2">
            سيتم إعادة توجيهك إلى الصفحة الرئيسية قريباً
          </p>
          <p className="text-gray-500 text-sm">
            شكراً على مساهمتك في تحسين جودة الخدمات
          </p>
        </Card>
      </div>
    );
  }

  const availableSpecializations = college
    ? SPECIALIZATIONS[college] || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-full shadow-lg">
              <h1 className="text-4xl font-bold text-white">
                استبيان تقييم اللجنة العلمية
              </h1>
            </div>
          </div>
          <p className="text-2xl text-gray-700 font-semibold mb-4">
            {SURVEY_TITLE}
          </p>
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-5 px-8 rounded-2xl inline-block mb-8 shadow-xl">
            <p className="text-2xl font-bold mb-2">
              تحت إشراف: {COMMITTEE_SUPERVISOR}
            </p>
            <p className="text-lg font-semibold">{COMMITTEE_SUPERVISOR_ROLE}</p>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            نرحب بك في استبيان تقييم أداء اللجنة العلمية. رأيك مهم جداً لنا
            ويساعدنا على تحسين جودة الخدمات المقدمة. نتطلع إلى تقييمك الصادق
            والموضوعي لجميع جوانب عمل اللجنة.
          </p>
        </div>

        {/* Form Section */}
        <Card className="p-10 shadow-2xl mb-12 bg-white rounded-3xl border-0">
          {/* Personal Information */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-4 border-blue-600">
              البيانات الشخصية
            </h2>

            <div className="space-y-7">
              {/* Full Name */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  الاسم الرباعي <span className="text-red-600">*</span>
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل اسمك الرباعي"
                  className="w-full h-12 text-lg rounded-xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* College */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  الكلية <span className="text-red-600">*</span>
                </label>
                <Select value={college} onValueChange={handleCollegeChange}>
                  <SelectTrigger className="w-full h-12 text-lg rounded-xl border-2 border-gray-300 focus:border-blue-600">
                    <SelectValue placeholder="اختر الكلية" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLLEGES.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  التخصص <span className="text-red-600">*</span>
                </label>
                <Select
                  value={specialization}
                  onValueChange={setSpecialization}
                  disabled={!college}
                >
                  <SelectTrigger className="w-full h-12 text-lg rounded-xl border-2 border-gray-300 focus:border-blue-600 disabled:bg-gray-100">
                    <SelectValue placeholder="اختر التخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpecializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Academic Level */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  المستوى الدراسي <span className="text-red-600">*</span>
                </label>
                <Select value={academicLevel} onValueChange={setAcademicLevel}>
                  <SelectTrigger className="w-full h-12 text-lg rounded-xl border-2 border-gray-300 focus:border-blue-600">
                    <SelectValue placeholder="اختر المستوى" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Survey Questions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-4 border-blue-600">
              أسئلة التقييم
            </h2>

            {getAllSections().map((section) => {
              const sectionQuestions = SURVEY_QUESTIONS.filter(
                (q) => q.section === section
              );
              return (
                <div key={section} className="mb-10">
                  <h3 className="text-2xl font-bold text-blue-700 mb-6 pb-3 border-b-2 border-blue-300">
                    {section}
                  </h3>

                  <div className="space-y-7">
                    {sectionQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-colors"
                      >
                        <p className="text-lg text-gray-800 font-semibold mb-4">
                          {question.text}
                        </p>
                        <div className="flex gap-2 flex-wrap items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                handleRating(question.id, star)
                              }
                              className="transition-all hover:scale-110 active:scale-100 p-1"
                            >
                              <Star
                                size={36}
                                className={
                                  star <= (ratings[question.id] || 0)
                                    ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                                    : "text-gray-300 hover:text-yellow-200"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Suggestions */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-4 border-blue-600">
              مقترحات التطوير
            </h2>
            <label className="block text-lg font-bold text-gray-800 mb-4">
              ما أبرز التطويرات أو التحسينات التي تود للجنة العلمية أن تقوم بها؟
            </label>
            <Textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="أدخل مقترحاتك وملاحظاتك هنا..."
              rows={6}
              className="w-full text-lg rounded-2xl border-2 border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 p-4"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال الاستبيان"}
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 px-8 rounded-2xl shadow-lg">
          <p className="text-lg font-semibold mb-3">{SURVEY_DEVELOPER}</p>
          <p className="text-2xl font-bold">{SURVEY_COORDINATOR}</p>
        </div>
      </div>
    </div>
  );
}

export default Survey;
