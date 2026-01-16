import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Preview() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight">
            استبيان تقييم
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              اللجنة العلمية
            </span>
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 leading-relaxed">
            الملتقى الطلابي بجامعة 21 سبتمبر
            <br />
            للعلوم الطبية والتطبيقية
          </h2>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 h-1 bg-gradient-to-r from-transparent to-blue-400"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <div className="flex-1 h-1 bg-gradient-to-l from-transparent to-blue-400"></div>
        </div>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          نرحب بك في استبيان تقييم أداء اللجنة العلمية. رأيك وتقييمك مهم جداً لنا
          ويساعدنا على تحسين جودة الخدمات المقدمة بشكل مستمر.
        </p>

        {/* CTA Button */}
        <div className="pt-8">
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-16 py-6 text-2xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            ابدأ الاستبيان الآن
          </Button>
        </div>

        {/* Footer Info */}
        <div className="pt-12 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            تحت إشراف: محمد الحسني - مسؤول اللجنة العلمية
          </p>
          <p className="text-gray-400 text-xs mt-2">
            تطوير: شاهر خالد اليعري
          </p>
        </div>
      </div>
    </div>
  );
}
