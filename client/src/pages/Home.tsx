import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle, BarChart3, Heart } from "lucide-react";
import { useState } from "react";
import DashboardLoginModal from "@/components/DashboardLoginModal";

export default function Home() {
  const [, navigate] = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleDashboardClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            استبيان اللجنة العلمية
          </h1>
          <Button
            onClick={handleDashboardClick}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            لوحة التحكم
          </Button>
          <DashboardLoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSuccess={handleLoginSuccess}
          />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            استبيان تقييم اللجنة العلمية
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            الملتقى الطلابي بجامعة 21 سبتمبر للعلوم الطبية والتطبيقية
          </p>
          <div className="bg-blue-600 text-white py-4 px-8 rounded-lg inline-block mb-8">
            <p className="text-lg font-semibold">تحت إشراف: محمد الحسني</p>
            <p className="text-sm">مسؤول اللجنة العلمية</p>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
            نرحب بك في استبيان تقييم أداء اللجنة العلمية. رأيك وتقييمك مهم جداً
            لنا ويساعدنا على تحسين جودة الخدمات المقدمة بشكل مستمر. نتطلع إلى
            تقييمك الصادق والموضوعي لجميع جوانب عمل اللجنة العلمية.
          </p>
          <Button
            onClick={() => navigate("/survey")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg"
          >
            ابدأ الاستبيان الآن
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
              سهل وسريع
            </h3>
            <p className="text-gray-600 text-center">
              استبيان بسيط وسهل الملء لا يستغرق أكثر من 5 دقائق
            </p>
          </Card>

          <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
              رأيك مهم
            </h3>
            <p className="text-gray-600 text-center">
              تقييمك سيساعد اللجنة على تحسين الخدمات المقدمة للطلاب
            </p>
          </Card>

          <Card className="p-8 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
              تحليلات شاملة
            </h3>
            <p className="text-gray-600 text-center">
              نستخدم تقييماتك لإنشاء تقارير تحليلية شاملة
            </p>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="p-8 bg-blue-50 border-2 border-blue-200 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            معلومات عن الاستبيان
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ماذا سيتم قياسه؟
              </h4>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>جودة التسجيلات الصوتية للمحاضرات</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>دقة وجودة الملخصات العلمية</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>فائدة نماذج الأسئلة</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>الأداء العام للجنة العلمية</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                كيف يتم التقييم؟
              </h4>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>نظام تقييم بالنجوم من 1 إلى 5</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>15 سؤال موزع على 4 أقسام</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>حقل مفتوح لمقترحات التطوير</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>الاستبيان سري وآمن تماماً</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* CTA Button */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            هل أنت مستعد لتقديم تقييمك؟
          </p>
          <Button
            onClick={() => navigate("/survey")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-lg"
          >
            ابدأ الاستبيان الآن
          </Button>
        </div>
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
