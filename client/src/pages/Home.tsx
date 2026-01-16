import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle, BarChart3, Heart, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              استبيان اللجنة العلمية
            </h1>
          </div>
          <Button
            onClick={handleDashboardClick}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
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
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full">
              <p className="text-blue-300 text-sm font-semibold">
                الملتقى الطلابي بجامعة 21 سبتمبر
              </p>
            </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            استبيان تقييم
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}اللجنة العلمية
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            للعلوم الطبية والتطبيقية
          </p>

          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 backdrop-blur-sm py-6 px-8 rounded-2xl inline-block mb-8">
            <p className="text-lg font-semibold text-blue-300 mb-2">
              تحت إشراف
            </p>
            <p className="text-3xl font-bold text-white">محمد الحسني</p>
            <p className="text-sm text-gray-300 mt-2">
              مسؤول اللجنة العلمية
            </p>
          </div>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
            نرحب بك في استبيان تقييم أداء اللجنة العلمية. رأيك وتقييمك مهم جداً
            لنا ويساعدنا على تحسين جودة الخدمات المقدمة بشكل مستمر.
          </p>

          <Button
            onClick={() => navigate("/survey")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            ابدأ الاستبيان الآن
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-8 hover:bg-white/15 transition-all hover:border-blue-400/50 hover:shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-3">
              سهل وسريع
            </h3>
            <p className="text-gray-300 text-center">
              استبيان بسيط وسهل الملء لا يستغرق أكثر من 5 دقائق
            </p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-8 hover:bg-white/15 transition-all hover:border-green-400/50 hover:shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-3">
              رأيك مهم
            </h3>
            <p className="text-gray-300 text-center">
              تقييمك سيساعد اللجنة على تحسين الخدمات المقدمة للطلاب
            </p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-8 hover:bg-white/15 transition-all hover:border-purple-400/50 hover:shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-3">
              تحليلات شاملة
            </h3>
            <p className="text-gray-300 text-center">
              نستخدم تقييماتك لإنشاء تقارير تحليلية شاملة
            </p>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-400/30 backdrop-blur-sm p-10 mb-20">
          <h3 className="text-3xl font-bold text-white mb-8">
            معلومات عن الاستبيان
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h4 className="font-bold text-blue-300 mb-4 text-lg">
                ماذا سيتم قياسه؟
              </h4>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 text-xl">✓</span>
                  <span>جودة التسجيلات الصوتية للمحاضرات</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 text-xl">✓</span>
                  <span>دقة وجودة الملخصات العلمية</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 text-xl">✓</span>
                  <span>فائدة نماذج الأسئلة</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 text-xl">✓</span>
                  <span>الأداء العام للجنة العلمية</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-blue-300 mb-4 text-lg">
                كيف يتم التقييم؟
              </h4>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 text-xl">✓</span>
                  <span>نظام تقييم بالنجوم من 1 إلى 5</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 text-xl">✓</span>
                  <span>15 سؤال موزع على 4 أقسام</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 text-xl">✓</span>
                  <span>حقل مفتوح لمقترحات التطوير</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 text-xl">✓</span>
                  <span>الاستبيان سري وآمن تماماً</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Developer Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 mb-20 shadow-2xl">
          <div className="text-center">
            <p className="text-blue-100 text-lg mb-3">تطوير واعداد</p>
            <h3 className="text-4xl font-bold text-white mb-4">
              شاهر خالد اليعري
            </h3>
            <p className="text-blue-100 text-lg">
              مطور وتصميم الاستبيان الإلكتروني
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <p className="text-gray-300 mb-8 text-lg">
            هل أنت مستعد لتقديم تقييمك؟
          </p>
          <Button
            onClick={() => navigate("/survey")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-12 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            ابدأ الاستبيان الآن
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300 mb-3">
            استبيان تقييم اللجنة العلمية - الملتقى الطلابي بجامعة 21 سبتمبر للعلوم الطبية والتطبيقية
          </p>
          <p className="text-gray-400 text-sm">
            تحت إشراف: محمد الحسني - مسؤول اللجنة العلمية
          </p>
          <p className="text-gray-400 text-sm mt-3">
            تطوير: شاهر خالد اليعري
          </p>
        </div>
      </footer>
    </div>
  );
}
