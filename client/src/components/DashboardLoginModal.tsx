import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

const ALLOWED_CREDENTIALS = [
  { email: "shahrkhaldalyryalyry@gmail.com", password: "7135900143shaher" },
  { email: "shaherprivates@gmail.com", password: "7135900143shaher" },
  { email: "shaheralyaari@gmail.com", password: "7135900143shaher" },
];

interface DashboardLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DashboardLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: DashboardLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isValid = ALLOWED_CREDENTIALS.some(
      (cred) => cred.email === email && cred.password === password
    );

    if (isValid) {
      // Store login state in localStorage
      localStorage.setItem("dashboardAuth", JSON.stringify({ email, timestamp: Date.now() }));
      onSuccess();
      setEmail("");
      setPassword("");
    } else {
      setError("البريد الإلكتروني أو كلمة السر غير صحيحة");
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right text-2xl font-bold text-blue-600">
            تسجيل الدخول إلى لوحة التحكم
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 text-right">
              البريد الإلكتروني
            </label>
            <Input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 text-right">
              كلمة السر
            </label>
            <Input
              type="password"
              placeholder="أدخل كلمة السر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="text-right"
              dir="rtl"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleLogin}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "جاري التحقق..." : "دخول"}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            لوحة التحكم متاحة فقط للمسؤولين المصرحين
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
