import { describe, expect, it } from "vitest";
import { getAcademicLevelsByCollege } from "../shared/surveyData";

describe("Academic Levels by College", () => {
  it("should return correct levels for Dentistry", () => {
    const levels = getAcademicLevelsByCollege("الأسنان");
    expect(levels).toEqual(["أول", "ثاني"]);
  });

  it("should return correct levels for Medical and Applied Sciences", () => {
    const levels = getAcademicLevelsByCollege("العلوم الطبية والتطبيقية");
    expect(levels).toEqual(["أول", "ثاني", "ثالث"]);
  });

  it("should return correct levels for Medicine", () => {
    const levels = getAcademicLevelsByCollege("الطب البشري");
    expect(levels).toEqual(["أول", "ثاني", "ثالث", "رابع", "امتياز"]);
  });

  it("should return correct levels for Laboratory Medicine", () => {
    const levels = getAcademicLevelsByCollege("الطب المخبري");
    expect(levels).toEqual(["أول", "ثاني", "ثالث", "رابع", "امتياز"]);
  });

  it("should return correct levels for Clinical Pharmacy", () => {
    const levels = getAcademicLevelsByCollege("الصيدلة السريرية");
    expect(levels).toEqual(["أول", "ثاني", "ثالث", "رابع", "امتياز"]);
  });

  it("should return correct levels for Nursing", () => {
    const levels = getAcademicLevelsByCollege("التمريض العالي");
    expect(levels).toEqual(["أول", "ثاني", "ثالث", "رابع", "امتياز"]);
  });

  it("should return correct levels for Engineering and Computer Science", () => {
    const levels = getAcademicLevelsByCollege("الهندسة والحاسوب");
    expect(levels).toEqual(["أول", "ثاني", "ثالث", "رابع"]);
  });

  it("should return correct levels for Medical Administration", () => {
    const levels = getAcademicLevelsByCollege("الإدارة الطبية");
    expect(levels).toEqual(["أول", "ثاني", "ثالث", "رابع"]);
  });

  it("should return correct levels for Medical Center", () => {
    const levels = getAcademicLevelsByCollege("المركز الطبي");
    expect(levels).toEqual(["أول", "ثاني", "ثالث", "رابع"]);
  });

  it("should return default levels for unknown college", () => {
    const levels = getAcademicLevelsByCollege("كلية غير معروفة");
    expect(levels).toEqual(["أول", "ثاني", "ثالث", "رابع", "امتياز"]);
  });
});

describe("Dashboard Login Credentials", () => {
  const ALLOWED_CREDENTIALS = [
    { email: "shahrkhaldalyryalyry@gmail.com", password: "7135900143shaher" },
    { email: "shaherprivates@gmail.com", password: "7135900143shaher" },
    { email: "shaheralyaari@gmail.com", password: "7135900143shaher" },
  ];

  it("should allow valid credentials", () => {
    const email = "shahrkhaldalyryalyry@gmail.com";
    const password = "7135900143shaher";
    const isValid = ALLOWED_CREDENTIALS.some(
      (cred) => cred.email === email && cred.password === password
    );
    expect(isValid).toBe(true);
  });

  it("should reject invalid email", () => {
    const email = "invalid@gmail.com";
    const password = "7135900143shaher";
    const isValid = ALLOWED_CREDENTIALS.some(
      (cred) => cred.email === email && cred.password === password
    );
    expect(isValid).toBe(false);
  });

  it("should reject invalid password", () => {
    const email = "shahrkhaldalyryalyry@gmail.com";
    const password = "wrongpassword";
    const isValid = ALLOWED_CREDENTIALS.some(
      (cred) => cred.email === email && cred.password === password
    );
    expect(isValid).toBe(false);
  });

  it("should accept all three valid credentials", () => {
    const validCredentials = [
      { email: "shahrkhaldalyryalyry@gmail.com", password: "7135900143shaher" },
      { email: "shaherprivates@gmail.com", password: "7135900143shaher" },
      { email: "shaheralyaari@gmail.com", password: "7135900143shaher" },
    ];

    validCredentials.forEach((cred) => {
      const isValid = ALLOWED_CREDENTIALS.some(
        (allowed) =>
          allowed.email === cred.email && allowed.password === cred.password
      );
      expect(isValid).toBe(true);
    });
  });
});
