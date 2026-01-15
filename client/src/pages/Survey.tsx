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
} from "@shared/surveyData";
import { Star } from "lucide-react";

export default function Survey() {
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
    setSpecialization(""); // Reset specialization when college changes
  };

  const handleRating = (questionId: number, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!fullName.trim()) {
      toast.error("الرجاء إدخال الاسم الرباعي");
      return;
    }
    if (!college) {
      toast.error("الرجاء اختيار الكلية");
      return;
    }
    if (!specialization) {
      toast.error("الرجاء اختيار التخصص");
      return;
    }
    if (!academicLevel) {
      toast.error("الرجاء اختيار المستوى الدراسي");
      return;
    }

    // Check if all questions are rated
    if (Object.keys(ratings).length !== SURVEY_QUESTIONS.length) {
      toast.error("الرجاء تقييم جميع الأسئلة");
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
      toast.success("تم إرسال الاستبيان بنجاح");

      // Reset form after 3 seconds
      setTimeout(() => {
        setFullName("");
        setCollege("");
        setSpecialization("");
        setAcademicLevel("");
        setSuggestions("");
        setRatings({});
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error("حدث خطأ في إرسال الاستبيان");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            شكراً لتقييمك
          </h2>
          <p className="text-gray-600 mb-4">
            تم إرسال البيانات إلى شاهر خالد اليعري
          </p>
          <p className="text-sm text-gray-500">
            سيتم إعادة توجيهك إلى الصفحة الرئيسية قريباً
          </p>
        </Card>
      </div>
    );
  }

  const availableSpecializations = college
    ? SPECIALIZATIONS[college] || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            استبيان تقييم اللجنة العلمية
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            جامعة 21 سبتمبر للعلوم الطبية والتطبيقية
          </p>
          <div className="bg-blue-600 text-white py-3 px-6 rounded-lg inline-block mb-6">
            <p className="text-lg font-semibold">
              تحت إشراف: محمد الحسني
            </p>
            <p className="text-sm">مسؤول اللجنة العلمية</p>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            نرحب بك في استبيان تقييم أداء اللجنة العلمية. رأيك مهم جداً لنا
            ويساعدنا على تحسين جودة الخدمات المقدمة. نتطلع إلى تقييمك الصادق
            والموضوعي لجميع جوانب عمل اللجنة.
          </p>
        </div>

        {/* Form Section */}
        <Card className="p-8 shadow-lg mb-8">
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              البيانات الشخصية
            </h2>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الرباعي
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل اسمك الرباعي"
                  className="w-full"
                />
              </div>

              {/* College */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الكلية
                </label>
                <Select value={college} onValueChange={handleCollegeChange}>
                  <SelectTrigger className="w-full">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  التخصص
                </label>
                <Select
                  value={specialization}
                  onValueChange={setSpecialization}
                  disabled={!college}
                >
                  <SelectTrigger className="w-full">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  المستوى الدراسي
                </label>
                <Select value={academicLevel} onValueChange={setAcademicLevel}>
                  <SelectTrigger className="w-full">
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              أسئلة التقييم
            </h2>

            {getAllSections().map((section) => {
              const sectionQuestions = SURVEY_QUESTIONS.filter(
                (q) => q.section === section
              );
              return (
                <div key={section} className="mb-8">
                  <h3 className="text-lg font-semibold text-blue-600 mb-4 pb-2 border-b-2 border-blue-200">
                    {section}
                  </h3>

                  <div className="space-y-6">
                    {sectionQuestions.map((question) => (
                      <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-800 font-medium mb-3">
                          {question.text}
                        </p>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                handleRating(question.id, star)
                              }
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                size={32}
                                className={
                                  star <= (ratings[question.id] || 0)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              مقترحات التطوير
            </h2>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ما أبرز التطويرات أو التحسينات التي تود للجنة العلمية أن تقوم بها؟
            </label>
            <Textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="أدخل مقترحاتك وملاحظاتك هنا..."
              rows={5}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-lg"
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال الاستبيان"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
