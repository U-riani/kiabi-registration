import React, { useState, useEffect, useMemo } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import RegionCitySelect from "../components/RegionCitySelect ";
import ReusableSearchSelect from "../components/ReusableSearchSelect";
import { useTranslation } from "react-i18next";
import LanguageButton from "../components/LanguageButton";
import { regions } from "../data/regions";
import { countries } from "../data/countries";
import { phonePrefixes } from "../data/phoneNumberPrefixes";
import { getCountryName, getCountryOptions } from "../utils/countryHelpers";
import PhonePrefixSelect from "../components/PhonePrefixSelect";

const getDaysInMonth = (month, year) => {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
};

export const MONTHS = {
  en: [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ],
  ka: [
    { value: 1, label: "იანვარი" },
    { value: 2, label: "თებერვალი" },
    { value: 3, label: "მარტი" },
    { value: 4, label: "აპრილი" },
    { value: 5, label: "მაისი" },
    { value: 6, label: "ივნისი" },
    { value: 7, label: "ივლისი" },
    { value: 8, label: "აგვისტო" },
    { value: 9, label: "სექტემბერი" },
    { value: 10, label: "ოქტომბერი" },
    { value: 11, label: "ნოემბერი" },
    { value: 12, label: "დეკემბერი" },
  ],
  ru: [
    { value: 1, label: "Январь" },
    { value: 2, label: "Февраль" },
    { value: 3, label: "Март" },
    { value: 4, label: "Апрель" },
    { value: 5, label: "Май" },
    { value: 6, label: "Июнь" },
    { value: 7, label: "Июль" },
    { value: 8, label: "Август" },
    { value: 9, label: "Сентябрь" },
    { value: 10, label: "Октябрь" },
    { value: 11, label: "Ноябрь" },
    { value: 12, label: "Декабрь" },
  ],
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

const HomePage = () => {
  // const baseURL = "https://kiabi-loyalty-server.vercel.app";
  const baseURL = "http://localhost:5000";

  const CARD_MASK = "XXX XXX XXX XXX XX";
  const CARD_MAX_DIGITS = 14;

  const initialFields = {
    gender: "",
    firstName: "",
    lastName: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    address: "",
    country: null,
    city: null,
    email: "",
    phoneNumber: "",
    verificationCode: "",
    cardNumber: "",
    promotionChanel1: true, // will be "true" or "false"
    promotionChanel2: true, // will be "true" or "false"
    termsAccepted: false,
    branch: "",
    prefix: "+995",
  };

  const [fieldsData, setFieldsData] = useState(initialFields);

  const daysInSelectedMonth = useMemo(() => {
    return getDaysInMonth(fieldsData.birthMonth, fieldsData.birthYear);
  }, [fieldsData.birthMonth, fieldsData.birthYear]);

  const { t, i18n } = useTranslation();

  const [showTerms, setShowTerms] = useState(false);
  const [otpHash, setOtpHash] = useState("");
  const [toggleCode, setToggleCode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errors, setErrors] = useState({});
  // const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  const fieldRefs = {
    gender: React.useRef(null),
    firstName: React.useRef(null),
    lastName: React.useRef(null),
    dateOfBirth: React.useRef(null),
    address: React.useRef(null),
    city: React.useRef(null),
    country: React.useRef(null),
    cardNumber: React.useRef(null),
    phoneNumber: React.useRef(null),
    verificationCode: React.useRef(null),
    agree: React.useRef(null),
  };

  const phoneInputRef = React.useRef(null);
  const cardInputRef = React.useRef(null);

  const isAtLeast14 = (day, month, year) => {
    if (!day || !month || !year) return false;

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 14;
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { longitude } = coords;

        // West Georgia → Batumi
        if (longitude < 43.5) {
          setFieldsData((prev) => ({ ...prev, branch: "batumi" }));
        }
        // East Georgia → Tbilisi
        else {
          setFieldsData((prev) => ({ ...prev, branch: "tbilisi" }));
        }
      },
      () => {
        setFieldsData((prev) => ({ ...prev, branch: "tbilisi" }));
      }
    );
  }, []);

  console.log(fieldsData.branch);

  useEffect(() => {
    setFieldsData((prev) => ({
      ...prev,
      country: i18n.language === "ka" ? 57 : null,
      city: null,
    }));
  }, [i18n.language]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const isValidPhoneLength = (raw) => {
    const cleaned = raw.replace(/[^0-9]/g, "");
    return cleaned.length >= 6 && cleaned.length <= 15;
  };

  const isValidEmail = (email) => {
    if (!email) return true; // optional field → empty is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const normalizePhone = (raw = "", prefix = "+995") => {
    const numericPrefix = prefix.replace(/[^0-9]/g, "");
    const cleaned = raw.replace(/[^0-9]/g, "");

    if (!cleaned) return "";

    // If user already typed full number (e.g. 9955xxxx)
    if (cleaned.startsWith(numericPrefix)) {
      return cleaned;
    }

    // Remove leading 0 (0555 → 555)
    let local = cleaned;
    if (local.startsWith("0")) local = local.slice(1);

    return numericPrefix + local;
  };

  const handleShowTerms = (e) => {
    if (e.target && e.target.id.includes("open-terms")) {
      setShowTerms((prev) => !prev);
    }
    if (e.target && e.target.closest("#close-terms")) {
      setShowTerms(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // remove error instantly when user types/selects
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    // Reset OTP when phone changes and when prefix changes
    if (name === "phoneNumber" || name === "prefix") {
      setIsVerified(false);
      setToggleCode(false);
      setOtpHash("");
      setCooldown(0);
      setInfoMessage("");

      setFieldsData((prev) => ({
        ...prev,
        verificationCode: "",
      }));
    }

    setFieldsData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClear = () => {
    setFieldsData({ ...initialFields });
    setOtpHash("");
    setIsVerified(false);
    setToggleCode(false);
    setCooldown(0);
    setInfoMessage("");
  };

  // ------------------- SEND OTP -------------------
  const handleGetCode = async (e) => {
    e.preventDefault();

    if (sendingCode || cooldown > 0) return; // safety

    setSendingCode(true);
    setErrors((prev) => ({ ...prev, phoneNumber: null }));

    const raw = fieldsData.phoneNumber.trim();
    try {
      // Basic check: empty
      if (!raw) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "Please enter phone number",
          verificationCode: "First enter valid phone number",
        }));
        return;
      }

      // Normalize phone (remove spaces, hyphens, symbols)
      // const cleaned = raw.replace(/[^0-9]/g, "");

      // Format to Georgian 995xxx
      let formattedPhone = normalizePhone(
        fieldsData.phoneNumber,
        fieldsData.prefix || "+995"
      );
      if (!formattedPhone) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "Invalid phone number",
        }));
        return;
      }
      if (!isValidPhoneLength(raw)) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "Enter a valid phone number",
          verificationCode: "First enter valid phone number",
        }));
        return;
      }

      // VALID — show info message
      setInfoMessage(`Verification code was sent to ${formattedPhone}`);
      setErrors((prev) => ({
        ...prev,
        verificationCode: undefined,
      }));

      // const formattedPhone = fieldsData.phoneNumber.startsWith("995")
      //   ? fieldsData.phoneNumber
      //   : `995${fieldsData.phoneNumber.replace(/^0/, "")}`;
console.log(formattedPhone)
      const res = await fetch(`${baseURL}/api/sms/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: formattedPhone }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrors((prev) => ({
          ...prev,
          phoneNumber: data.error || "Couldn't send code",
        }));
        return;
      }

      setOtpHash(data.hash);
      setToggleCode(true);
      setCooldown(60); // Start 60-second cooldown ONLY when OTP sent successfully

      // alert("კოდი გაიგზავნა");
    } catch (err) {
      console.error(err);
      // alert("ვერ გაიგზავნა კოდი");
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Network error sending OTP",
      }));
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (verifyingCode) return;

    setVerifyingCode(true);
    setErrors((prev) => ({ ...prev, verificationCode: null }));
    const raw = fieldsData.phoneNumber.trim();
    // const cleaned = raw.replace(/[^0-9]/g, "");

    if (!isValidPhoneLength(raw)) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "Please first insert correct mobile number",
      }));

      return;
    }
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.verificationCode;
      return copy;
    });

    try {
      const formattedPhone = normalizePhone(
        fieldsData.phoneNumber,
        fieldsData.prefix || "+995"
      );

      const res = await fetch(`${baseURL}/api/sms/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          hash: otpHash,
          code: fieldsData.verificationCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsVerified(true);
        setToggleCode(false);
        setCooldown(0);
        setInfoMessage("");
        return;
      }

      // OTP incorrect
      setErrors((prev) => ({
        ...prev,
        verificationCode: data.message || "The verification code is incorrect.",
      }));
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        verificationCode: "Verification failed — try again.",
      }));
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Manual validation
    const newErrors = {};

    // birthdate validation
    const { birthDay, birthMonth, birthYear } = fieldsData;
    if (!birthDay || !birthMonth || !birthYear) {
      newErrors.dateOfBirth = t("PleaseEnterYourBirthDate");
    } else if (!isAtLeast14(birthDay, birthMonth, birthYear)) {
      newErrors.dateOfBirth = t("YouMustBeAtLeast14");
    }
    if (!fieldsData.gender) newErrors.gender = "select gender";
    if (!fieldsData.firstName.trim()) newErrors.firstName = "enter first name";
    if (!fieldsData.lastName.trim()) newErrors.lastName = "enter last name";
    if (!fieldsData.address.trim()) newErrors.address = "enter address";
    if (fieldsData.city === null || fieldsData.city === undefined)
      newErrors.city = "select city";
    if (fieldsData.country === null || fieldsData.country === undefined)
      newErrors.country = "select country";
    if (!fieldsData.cardNumber.trim())
      newErrors.cardNumber = "enter card number";

    /// PHONE NUMBER VALIDATION
    if (!fieldsData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Please enter phone number";
    } else if (!isValidPhoneLength(fieldsData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid phone number";
    }

    // VERIFICATION CHECK
    if (!isVerified) {
      newErrors.verificationCode = "verify phone";
    }
    if (!fieldsData.termsAccepted) newErrors.termsAccepted = "accept terms";

    if (fieldsData.email && !isValidEmail(fieldsData.email.trim())) {
      newErrors.email = "Enter a valid email";
    }

    setErrors(newErrors);

    // If errors exist → scroll to first one
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const ref = fieldRefs[firstErrorKey];

      if (ref && ref.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return;
    }

    try {
      setLoading(true);
      // setSuccessMessage("");

      const normalized = normalizePhone(
        fieldsData.phoneNumber,
        fieldsData.prefix
      );

      const numericPrefix = fieldsData.prefix.replace(/\D/g, "");

      const phone = normalized.startsWith(numericPrefix)
        ? normalized.slice(numericPrefix.length)
        : normalized;
      const formattedBirthDate = `${birthYear}-${String(birthMonth).padStart(
        2,
        "0"
      )}-${String(birthDay).padStart(2, "0")}`;

      const req = await fetch(`${baseURL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: fieldsData.gender,
          firstName: fieldsData.firstName.trim(),
          lastName: fieldsData.lastName.trim(),
          dateOfBirth: formattedBirthDate,
          address: fieldsData.address.trim(),
          country: getCountryName(countries, fieldsData.country, "en"),
          city: getCountryName(regions, fieldsData.city, "en"),
          email: fieldsData.email.trim() || null,
          cardNumber: fieldsData.cardNumber.trim(),
          phoneNumber: phone,
          phoneCode: fieldsData.prefix,
          promotionChanel1: fieldsData.promotionChanel1,
          promotionChanel2: fieldsData.promotionChanel2,
          termsAccepted: fieldsData.termsAccepted,
          branch: fieldsData.branch,
        }),
      });
      console.log(fieldsData.termsAccepted);

      const resData = await req.json();

      if (resData.success) {
        handleClear();
        setShowSuccessModal(true);
      } else {
        alert("რეგისტრაცია ვერ განხორციელდა");
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const GLOBAL_MAX_DIGITS = 15;

  const getCursorPosFromDigits = (digitsLength, mask) => {
    let pos = 0;
    let digitsSeen = 0;

    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === "X") {
        if (digitsSeen === digitsLength) break;
        digitsSeen++;
      }
      pos++;
    }

    return pos;
  };

  const getPhoneMaskByPrefix = (prefix) => {
    switch (prefix) {
      case "+995":
        return {
          mask: "XXX XX XX XX",
          maxDigits: 9, // local Georgian number
        };

      default:
        return {
          mask: "XXXXXXXXXXXXXXX",
          maxDigits: GLOBAL_MAX_DIGITS,
        };
    }
  };

  const maskNumber = (digits = "", mask = "") => {
    let result = "";
    let i = 0;

    for (const char of mask) {
      if (char === "X") {
        result += digits[i] ?? "X";
        i++;
      } else {
        result += char;
      }
    }

    return result;
  };
  const { mask, maxDigits } = getPhoneMaskByPrefix(fieldsData.prefix);

  useEffect(() => {
    const el = phoneInputRef.current;
    if (!el) return;

    const cursorPos = getCursorPosFromDigits(
      fieldsData.phoneNumber.length,
      mask
    );

    requestAnimationFrame(() => {
      el.setSelectionRange(cursorPos, cursorPos);
    });
  }, [fieldsData.phoneNumber, mask]);

  useEffect(() => {
    const el = cardInputRef.current;
    if (!el) return;

    const cursorPos = getCursorPosFromDigits(
      fieldsData.cardNumber.length,
      CARD_MASK
    );

    requestAnimationFrame(() => {
      el.setSelectionRange(cursorPos, cursorPos);
    });
  }, [fieldsData.cardNumber]);

  useEffect(() => {
    setFieldsData((prev) => {
      // 🇬🇪 Georgia: enforce leading 5
      if (fieldsData.prefix === "+995") {
        if (!prev.phoneNumber.startsWith("5")) {
          return { ...prev, phoneNumber: "5" + prev.phoneNumber };
        }
        return prev;
      }

      // 🌍 Other countries: remove forced Georgian 5
      if (prev.phoneNumber.startsWith("5")) {
        return { ...prev, phoneNumber: prev.phoneNumber.slice(1) };
      }

      return prev;
    });
  }, [fieldsData.prefix]);

  useEffect(() => {
    setIsVerified(false);
    setToggleCode(false);
    setOtpHash("");
    setCooldown(0);
    setInfoMessage("");

    setFieldsData((prev) => ({
      ...prev,
      verificationCode: "",
    }));
  }, [fieldsData.phoneNumber, fieldsData.prefix]);

  useEffect(() => {
    const maxDay = getDaysInMonth(fieldsData.birthMonth, fieldsData.birthYear);

    if (fieldsData.birthDay && Number(fieldsData.birthDay) > maxDay) {
      setFieldsData((prev) => ({
        ...prev,
        birthDay: "",
      }));
    }
  }, [fieldsData.birthMonth, fieldsData.birthYear]);

  return (
    <div className="relative">
      <LanguageButton />
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm w-full">
            <div className="text-green-600 text-5xl mb-3">✔</div>
            <h3 className="text-xl  font-semibold mb-2">
              გაგზავნა წარმატებულია
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              თქვენი მონაცემები წარმატებით გაიგზავნა.
            </p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showTerms && (
        <div
          id="open-terms-container"
          className="fixed w-full h-full z-10 flex justify-center bg-stone-900/30 p-3 sm:py-9"
          onClick={handleShowTerms}
        >
          <div className="relative max-w-[900px] bg-[#fff] px-5 pb-5 overflow-y-scroll rounded">
            <div className="flex flex-row justify-between bg-[#fff] py-5 sticky top-0">
              <h4 className="text-xl capitalize font-bold ">
                {t("termsAndConditions")}
              </h4>
              <button
                type="button"
                id="close-terms"
                className="cursor-pointer p-3 -mt-3 -me-3"
                onClick={handleShowTerms}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="">
              <ol type="1" className="flex flex-col gap-1 mb-2">
                <li>
                  <span>1. </span>
                  {t("termsRule1")}
                </li>
                <li>
                  <span>1.1 </span>
                  {t("termsRule1_2")}
                </li>
                <li>
                  <p>
                    <span>2. </span>
                    {t("termsRule2")}
                  </p>
                </li>
                <li>
                  <span>3. </span>
                  {t("termsRule3")}
                </li>
                <li>
                  <span>4. </span>
                  {t("termsRule4")}
                </li>
                <li>
                  <span>5. </span>
                  {t("termsRule5")}
                </li>
                <li>
                  <span>6. </span>
                  {t("termsRule6")}
                </li>
                <li>
                  <span>7. </span>
                  {t("termsRule7")}
                </li>
                <li>
                  <span>7.1 </span>
                  {t("termsRule7_1")}
                </li>
                <li>
                  <span>7.2 </span>
                  {t("termsRule7_2")}
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
      <div className="w-full bg-[#f8f9fa] py-4 sm:py-10 px-3">
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-5 md:gap-10 bg-[#fff] rounded  p-5 sm:p-7  xl:p-10 border border-slate-300 rounded shadow-2xl">
            <div className="flex justify-center items-center">
              {/* <img src="/kiabi-logo1.jpg" alt="Kiabi logo" className="h-24" /> */}
              <div>
                <svg
                  className="logo-kiabi"
                  height="44"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0 0 106.29 24"
                >
                  <g>
                    <path
                      fill="#040037"
                      d="M72.24,4.87c-.3-.56-.63-.49-.93-.49h-3.94c-.33,0-.47-.03-.27.37.12.25.72,1.34.72,1.34.13.27.07.28-.04.47-.09.14-6.81,11.42-7.39,12.36-.47.74-.62.89.13.89h.92c.43,0,.49,0,.98-.81.26-.44,2.24-3.67,2.24-3.67h7.79c.22,0,.35.18.39.26.48.91,1.21,2.3,1.73,3.27.31.59.54.93.96.93h3.9c.74,0,.71,0,.14-1.04-.74-1.34-6.29-11.96-7.32-13.9M65.4,13.8l3.15-5.4c.29-.53.25-.42.47,0,.11.21,2.87,5.4,2.87,5.4h-6.49Z"
                    ></path>
                    <path
                      fill="#040037"
                      d="M49.33,4.38h-2.77c-2.14,1.66-2.21,1.69-9.96,7.59v-7.17c0-.24-.19-.43-.43-.43h-4.02c-.24,0-.43.19-.43.43v14.58c0,.23.19.43.43.43h4.02c.24,0,.43-.19.43-.43v-6.29c1.18,1.17,7.57,6.72,7.57,6.72h5.26c.4,0,.4-.21.06-.5-4.73-4.01-7.29-6.23-8.29-7.12-.45-.4-.68-.51-.34-.79.48-.39,8.3-6.51,8.51-6.73.21-.21-.04-.3-.04-.3"
                    ></path>
                    <path
                      fill="#040037"
                      d="M56.81,4.37h-3.98c-.25,0-.45.19-.45.43v14.58c0,.23.2.43.45.43h3.98c.25,0,.45-.19.45-.43V4.8c0-.24-.2-.43-.45-.43"
                    ></path>
                    <path
                      fill="#040037"
                      d="M105.53,4.37h-3.98c-.25,0-.45.19-.45.43v14.58c0,.23.2.43.45.43h3.98c.25,0,.45-.19.45-.43V4.8c0-.24-.2-.43-.45-.43"
                    ></path>
                    <path
                      fill="#040037"
                      d="M94.3,11.6c.68-.3,3.47-.54,3.47-3.63,0-3.55-3.88-3.53-4.77-3.61h-9.71c-.24,0-.43.21-.43.44v14.59c0,.24.19.41.43.41h8.7c1.41,0,6.29-.5,6.42-4.13.11-3.3-3.42-3.81-4.11-4.07M88.12,10.96v-4.94h1.94c1.94,0,2.79,1.24,2.79,2.61s-1.02,2.61-2.79,2.6h0s-.26,0-.26,0h-1.68v-.28ZM90.37,18.62h0s-.31.01-.31.01h-1.94v-6.06h2.25c2.32,0,3.34,1.44,3.34,3.03s-1.22,3.03-3.34,3.02"
                    ></path>
                  </g>
                  <g>
                    <path
                      fill="#040037"
                      d="M24.42,7.93c0-4.18-3.39-7.57-7.57-7.57-1.3,0-2.53.33-3.6.91-.92-.58-2.02-.91-3.19-.91h-3.82C2.91.36.21,3.06.21,6.39v11.4c0,3.33,2.7,6.03,6.03,6.03h3.82c1.15,0,2.22-.32,3.14-.88,1.06.56,2.27.88,3.55.88,4.2,0,7.6-3.4,7.6-7.6,0-1.51-.44-2.91-1.2-4.1.8-1.2,1.27-2.64,1.27-4.19Z"
                    ></path>
                    <path
                      fill="#ffffff"
                      d="M16.85,4.31c.06,0,.12,0,.18,0,.91.04,1.77.43,2.41,1.08,1.42,1.43,1.41,3.66-.01,5.08l-1.62,1.63h0l1.53,1.53c1.43,1.43,1.43,3.75,0,5.17-.71.71-1.65,1.07-2.58,1.07s-1.87-.36-2.58-1.07l-2.1-2.1v1.08c0,1.11-.9,2.01-2.01,2.01h-3.82c-1.11,0-2.01-.9-2.01-2.01V6.39c0-1.11.9-2.01,2.01-2.01h3.82c1.11,0,2.01.9,2.01,2.01v3.04l-1.8,1.8v-4.45c0-.33-.27-.6-.6-.6h-3.04c-.33,0-.6.27-.6.6v10.61c0,.33.27.6.6.6h3.04c.33,0,.6-.27.6-.6v-5.04l5.17,5.18c.36.36.84.54,1.31.54s.95-.18,1.31-.54c.72-.72.72-1.9,0-2.62l-2.8-2.81,2.9-2.9c.73-.73.73-1.82,0-2.55-.35-.35-.82-.54-1.31-.54-.01,0-.02,0-.03,0-.49,0-.96.22-1.3.57l-.55.55c-.18.18-.41.26-.64.26s-.46-.09-.64-.26c-.35-.35-.35-.92,0-1.27l.58-.58c.69-.69,1.61-1.07,2.58-1.07"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
            <div>
              <form
                className="flex flex-col gap-4 bg-[#fff] font-Roboto w-full max-w-[800px] p-5 sm:p-7 xl:p-10 shadow-xl border border-neutral-200 rounded "
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                    e.preventDefault();
                  }
                }}
              >
                <div className="mb-5">
                  <h5 className="text-2xl text-[#040037] text-center font-bold font-Roboto">
                    {t("loyaltyCard")}
                  </h5>

                  <p className="text-center text-slate-600">
                    {t("registrationForm")}
                  </p>
                </div>

                <div className="flex flex-col gap-2" ref={fieldRefs.gender}>
                  <div>
                    <p className="text-[#040037] font-bold">{t("gender")}: *</p>
                    {errors.gender && (
                      <p className="text-red-600 text-sm mt-1">
                        {t("pleaseSelectGender") || "Please select gender"}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-row justify-around rounded border-gray-400 bg-gray-400">
                    {["female", "male", "other"].map((g, i) => {
                      const isActive = fieldsData.gender === g;

                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            // Clear gender error immediately when user clicks
                            setErrors((prev) => ({ ...prev, gender: false }));
                            handleChange({
                              target: { name: "gender", value: g },
                            });
                          }}
                          className={`px-4 py-2 font-medium transition-all flex-1 border cursor-pointer
            ${i === 0 ? "rounded-l" : ""}
            ${i === 2 ? "rounded-r" : ""}
            ${
              isActive
                ? "bg-[#040037] border text-white shadow border-[#040037]"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-400"
            }`}
                        >
                          {g === "female"
                            ? t("female")
                            : g === "male"
                            ? t("male")
                            : t("other")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row ">
                  <div
                    className="flex flex-col justify-end gap-2 md:w-[150px] "
                    ref={fieldRefs.firstName}
                  >
                    <label
                      htmlFor="firstName"
                      className="text-[#040037] font-bold"
                    >
                      {t("firstName")} *
                    </label>
                    {errors.firstName && (
                      <p className="text-red-600 text-sm">
                        Please enter your first name
                      </p>
                    )}

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="border px-2 py-1 rounded border-gray-400"
                      value={fieldsData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="flex flex-col justify-end flex-1 gap-2"
                    ref={fieldRefs.lastName}
                  >
                    <label
                      htmlFor="lastName"
                      className="text-[#040037] font-bold"
                    >
                      {t("lastName")} *
                    </label>
                    {errors.lastName && (
                      <p className="text-red-600 text-sm">
                        Please enter your last name
                      </p>
                    )}

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="border px-2 py-1 rounded border-gray-400"
                      value={fieldsData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-col gap-2"
                  ref={fieldRefs.dateOfBirth}
                >
                  <div
                    className="flex flex-col gap-2"
                    ref={fieldRefs.dateOfBirth}
                  >
                    <label className="text-[#040037] font-bold">
                      {t("birthDate")} *
                    </label>

                    {errors.dateOfBirth && (
                      <p className="text-red-600 text-sm">
                        {errors.dateOfBirth}
                      </p>
                    )}

                    <div className="flex gap-3">
                      {/* DAY */}
                      <select
                        value={fieldsData.birthDay}
                        onChange={(e) => {
                          setErrors((prev) => ({
                            ...prev,
                            dateOfBirth: undefined,
                          }));
                          setFieldsData((p) => ({
                            ...p,
                            birthDay: e.target.value,
                          }));
                        }}
                        className="border px-2 py-1 rounded flex-1 border-gray-400"
                      >
                        <option value="">{t("day")}</option>
                        {Array.from(
                          { length: daysInSelectedMonth },
                          (_, i) => i + 1
                        ).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>

                      {/* MONTH */}
                      <select
                        value={fieldsData.birthMonth}
                        onChange={(e) => {
                          setErrors((prev) => ({
                            ...prev,
                            dateOfBirth: undefined,
                          }));
                          setFieldsData((p) => ({
                            ...p,
                            birthMonth: e.target.value,
                          }));
                        }}
                        className="border px-2 py-1 rounded flex-1 border-gray-400"
                      >
                        <option value="">{t("month")}</option>
                        {MONTHS[i18n.language].map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>

                      {/* YEAR */}
                      <select
                        value={fieldsData.birthYear}
                        onChange={(e) => {
                          setErrors((prev) => ({
                            ...prev,
                            dateOfBirth: undefined,
                          }));
                          setFieldsData((p) => ({
                            ...p,
                            birthYear: e.target.value,
                          }));
                        }}
                        className="border px-2 py-1 rounded flex-1 border-gray-400"
                      >
                        <option value="">{t("year")}</option>
                        {YEARS.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2" ref={fieldRefs.address}>
                  <label htmlFor="address" className="text-[#040037] font-bold">
                    {t("address")} *
                  </label>
                  {errors.address && (
                    <p className="text-red-600 text-sm">
                      Please enter your address
                    </p>
                  )}

                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="border px-2 py-1 rounded flex-1 border-gray-400"
                    value={fieldsData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row  gap-5">
                  <div
                    className="flex flex-col flex-1 gap-2"
                    ref={fieldRefs.city}
                  >
                    <label htmlFor="city" className="text-[#040037] font-bold">
                      {t("city")} *
                    </label>
                    {errors.city && (
                      <p className="text-red-600 text-sm">Please select city</p>
                    )}

                    {/* <input
                      id="country"
                      name="country"
                      type="text"
                      className="border px-2 py-1 rounded flex-1"
                      value={fieldsData.country}
                      onChange={handleChange}
                    /> */}
                    <ReusableSearchSelect
                      forElement="city"
                      options={getCountryOptions(regions, i18n.language)}
                      value={getCountryName(
                        regions,
                        fieldsData.city,
                        i18n.language
                      )}
                      onChange={(id) => {
                        setErrors((prev) => ({ ...prev, city: undefined }));
                        setFieldsData((prev) => ({ ...prev, city: id }));
                      }}
                      error={errors.city}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2" ref={fieldRefs.country}>
                  <label htmlFor="country" className="text-[#040037] font-bold">
                    {t("country")} *
                  </label>
                  {errors.country && (
                    <p className="text-red-600 text-sm">
                      Please select country
                    </p>
                  )}

                  <ReusableSearchSelect
                    forElement="country"
                    options={getCountryOptions(countries, i18n.language)}
                    value={getCountryName(
                      countries,
                      fieldsData.country,
                      i18n.language
                    )}
                    flags
                    onChange={(id) => {
                      setErrors((prev) => ({ ...prev, country: undefined }));
                      setFieldsData((prev) => ({ ...prev, country: id }));
                    }}
                    error={errors.country}
                  />
                </div>

                <div className="flex flex-col gap-2" ref={fieldRefs.cardNumber}>
                  <label
                    htmlFor="cardNumber"
                    className="text-[#040037] font-bold"
                  >
                    {t("cardNumber")} *
                  </label>
                  {errors.cardNumber && (
                    <p className="text-red-600 text-sm">
                      Please enter your Card number
                    </p>
                  )}

                  <input
                    ref={cardInputRef}
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    spellCheck={false}
                    className="border px-2 py-1 rounded flex-1 border-gray-400"
                    value={maskNumber(fieldsData.cardNumber, CARD_MASK)}
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                      ];

                      // BACKSPACE
                      if (e.key === "Backspace") {
                        e.preventDefault();
                        setFieldsData((prev) => ({
                          ...prev,
                          cardNumber: prev.cardNumber.slice(0, -1),
                        }));
                        return;
                      }

                      // Allow navigation
                      if (allowedKeys.includes(e.key)) return;

                      // Digits only
                      if (!/^[0-9]$/.test(e.key)) {
                        e.preventDefault();
                        return;
                      }

                      // Add digit
                      e.preventDefault();
                      setFieldsData((prev) => {
                        if (prev.cardNumber.length >= CARD_MAX_DIGITS)
                          return prev;
                        return {
                          ...prev,
                          cardNumber: prev.cardNumber + e.key,
                        };
                      });
                    }}
                    onFocus={(e) => {
                      requestAnimationFrame(() => {
                        const cursorPos = getCursorPosFromDigits(
                          fieldsData.cardNumber.length,
                          CARD_MASK
                        );
                        e.target.setSelectionRange(cursorPos, cursorPos);
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[#040037] font-bold">
                      {t("email")}
                    </label>
                    {errors.email && (
                      <p className="text-red-600 text-sm">{errors.email}</p>
                    )}
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="border px-2 py-1 rounded flex-1 border-gray-400"
                    value={fieldsData.email}
                    onChange={handleChange}
                  />
                </div>
                <div
                  className="flex flex-col gap-2"
                  ref={fieldRefs.phoneNumber}
                >
                  <label
                    htmlFor="phoneNumber"
                    className="text-[#040037] font-bold"
                  >
                    {t("mobile")} *
                  </label>
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-sm">{errors.phoneNumber}</p>
                  )}
                  <div className="flex gap-4">
                    <PhonePrefixSelect
                      value={fieldsData.prefix}
                      onChange={(code) =>
                        handleChange({
                          target: { name: "prefix", value: code },
                        })
                      }
                    />

                    <input
                      ref={phoneInputRef}
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      spellCheck={false}
                      className="border px-2 py-1 rounded flex-1 border-gray-400"
                      value={maskNumber(fieldsData.phoneNumber, mask)}
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Tab",
                          "ArrowLeft",
                          "ArrowRight",
                          "Delete",
                        ];

                        // BACKSPACE (single source of truth)
                        if (e.key === "Backspace") {
                          e.preventDefault();
                          setFieldsData((prev) => {
                            // 🇬🇪 Protect mandatory leading 5
                            if (
                              prev.prefix === "+995" &&
                              prev.phoneNumber.length <= 1
                            ) {
                              return prev;
                            }
                            return {
                              ...prev,
                              phoneNumber: prev.phoneNumber.slice(0, -1),
                            };
                          });
                          return;
                        }

                        // Other control keys
                        if (allowedKeys.includes(e.key)) {
                          return;
                        }

                        // Digits only
                        if (!/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                          return;
                        }

                        // Add digit
                        e.preventDefault();
                        setFieldsData((prev) => {
                          if (prev.phoneNumber.length >= maxDigits) return prev;
                          return {
                            ...prev,
                            phoneNumber: prev.phoneNumber + e.key,
                          };
                        });
                      }}
                      onFocus={(e) => {
                        requestAnimationFrame(() => {
                          const cursorPos = getCursorPosFromDigits(
                            fieldsData.phoneNumber.length,
                            mask
                          );
                          e.target.setSelectionRange(cursorPos, cursorPos);
                        });
                      }}
                    />
                  </div>
                </div>

                <div
                  className="flex flex-col  gap-2 pt-1"
                  ref={fieldRefs.verificationCode}
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-[#040037] font-bold">
                      {t("verificationCode")} *
                    </p>
                    {errors.verificationCode && (
                      <p className="text-red-600 text-sm">
                        {errors.verificationCode}
                      </p>
                    )}
                    {infoMessage && (
                      <p className="text-blue-600 text-sm">{infoMessage}</p>
                    )}
                  </div>
                  <div className="flex flex-1 gap-4">
                    {/* <label htmlFor="">მობილურის ნომერი</label> */}
                    <input
                      name="verificationCode"
                      type="text"
                      value={fieldsData.verificationCode}
                      onChange={handleChange}
                      className={`border px-2 py-1 rounded flex-1
                      ${
                        isVerified
                          ? "border-green-500"
                          : errors.verificationCode
                          ? "border-red-500"
                          : "border-gray-400"
                      }`}
                    />

                    {/* GET CODE BUTTON */}
                    {!toggleCode && !isVerified && (
                      <button
                        type="button"
                        disabled={cooldown > 0 || sendingCode}
                        onClick={handleGetCode}
                        className={`px-5 py-1 rounded text-white  
    ${
      cooldown > 0 || sendingCode
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#040037]"
    }`}
                      >
                        {sendingCode
                          ? t("sendingCode") || "Sending..."
                          : cooldown > 0
                          ? `${t("resendIn")} (${cooldown})`
                          : t("getCode")}
                      </button>
                    )}

                    {/* VERIFY BUTTON */}
                    {toggleCode && !isVerified && (
                      <button
                        type="button"
                        disabled={verifyingCode}
                        onClick={handleVerifyCode}
                        className={`px-5 py-1 rounded text-white 
    ${
      verifyingCode
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }`}
                      >
                        {verifyingCode
                          ? t("checking") || "Checking..."
                          : t("verify")}
                      </button>
                    )}

                    {/* STATUS: VERIFIED */}
                    {isVerified && (
                      <button
                        type="button"
                        disabled
                        className="px-5 py-1 rounded bg-gray-300 text-gray-600 cursor-not-allowed"
                      >
                        {t("verified")}{" "}
                        <span className="text-green-400">✔</span>
                      </button>
                    )}
                  </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <p htmlFor="" className="text-[#040037] font-bold">
                    {t("receiveNews")}:
                  </p>
                  <div className="flex flex-col items-start justify-center gap-3">
                    <div
                      className="flex flex-col items-start gap-3"
                      ref={fieldRefs.promotionChanel1}
                    >
                      {errors.promotionChanel1 && (
                        <p className="text-red-600 text-sm">Please select</p>
                      )}
                      <div className="flex items-center gap-3">
                        <p>{t("bySms")}:</p>

                        <div className="flex flex-row gap-2">
                          <label htmlFor="promotionChanel1-yes">
                            {t("yes")}
                          </label>
                          <input
                            id="promotionChanel1-yes"
                            type="radio"
                            name="promotionChanel1"
                            value="true"
                            checked={fieldsData.promotionChanel1 === true}
                            onChange={(e) => {
                              setErrors((prev) => ({
                                ...prev,
                                promotionChanel1: undefined,
                              }));

                              setFieldsData((prev) => ({
                                ...prev,
                                promotionChanel1: e.target.value === "true",
                              }));
                            }}
                          />
                        </div>

                        <div className="flex flex-row gap-2">
                          <label htmlFor="promotionChanel1-no">{t("no")}</label>
                          <input
                            id="promotionChanel1-no"
                            type="radio"
                            name="promotionChanel1"
                            value="false"
                            checked={fieldsData.promotionChanel1 === false}
                            onChange={(e) => {
                              setErrors((prev) => ({
                                ...prev,
                                promotionChanel1: undefined,
                              }));

                              setFieldsData((prev) => ({
                                ...prev,
                                promotionChanel1:
                                  e.target.value === "true" ? true : false,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-start gap-3"
                      ref={fieldRefs.promotionChanel2}
                    >
                      {errors.promotionChanel2 && (
                        <p className="text-red-600 text-sm">Please select</p>
                      )}
                      <div className="flex flex-row items-start gap-3">
                        <p>{t("byEmail")}:</p>

                        <div className="flex flex-row gap-2">
                          <label htmlFor="promotionChanel2-yes">
                            {t("yes")}
                          </label>
                          <input
                            id="promotionChanel2-yes"
                            type="radio"
                            name="promotionChanel2"
                            value="true"
                            checked={fieldsData.promotionChanel2 === true}
                            onChange={(e) => {
                              setErrors((prev) => ({
                                ...prev,
                                promotionChanel2: undefined,
                              }));

                              setFieldsData((prev) => ({
                                ...prev,
                                promotionChanel2: e.target.value === "true",
                              }));
                            }}
                          />
                        </div>

                        <div className="flex flex-row gap-2">
                          <label htmlFor="promotionChanel2-no">{t("no")}</label>
                          <input
                            id="promotionChanel2-no"
                            type="radio"
                            name="promotionChanel2"
                            value="false"
                            checked={fieldsData.promotionChanel2 === false}
                            onChange={(e) => {
                              setErrors((prev) => ({
                                ...prev,
                                promotionChanel2: undefined,
                              }));
                              setFieldsData((prev) => ({
                                ...prev,
                                promotionChanel2:
                                  e.target.value === "true" ? true : false,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="flex flex-col gap-2">
                  {errors.termsAccepted && (
                    <p className="text-red-600 text-sm">Please mark agree</p>
                  )}
                  <div className="flex flex-row items-center gap-2">
                    <input
                      type="checkbox"
                      checked={fieldsData.termsAccepted}
                      onChange={(e) => {
                        setErrors((prev) => ({
                          ...prev,
                          termsAccepted: undefined,
                        }));
                        setFieldsData((prev) => ({
                          ...prev,
                          termsAccepted: e.target.checked,
                        }));
                      }}
                    />

                    <p className="text-[#040037] font-bold">
                      {t("termsAgreeText")}
                      <span
                        className="text-[#040037]/60 cursor-pointer underline ps-1"
                        onClick={handleShowTerms}
                        id="open-terms"
                      >
                        {t("termsAndConditions")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    type="button"
                    className="bg-slate-300 py-2 px-3 rounded"
                    onClick={handleClear}
                  >
                    {t("clear")}
                  </button>

                  <button
                    type="submit"
                    className="bg-[#040037] py-2 px-3 rounded flex-1 text-slate-50 disabled:bg-gray-400"
                    disabled={loading}
                  >
                    {loading ? `${t("sending")}` : `${t("submit")}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
