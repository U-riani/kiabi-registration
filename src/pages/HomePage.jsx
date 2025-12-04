import React, { useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RegionCitySelect from "../components/RegionCitySelect ";

const HomePage = () => {
  const [fieldsData, setFieldsData] = useState({
    gender: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    zipCode: "",
    country: "",
    email: "",
    phoneNumber: "",
    verifivationCode: "",
    cardNumber: "",
    promotionChanel1: false,
    promotionChanel2: false,
    branch: "tbilisi",
  });
  const [showTerms, setShowTerms] = useState(false);
  const [otpHash, setOtpHash] = useState("");
  const [toggleCode, setToggleCode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    // Reset OTP when phone changes
    if (name === "phoneNumber") {
      setIsVerified(false);
      setOtpHash("");
      setToggleCode(false);
      setFieldsData((prev) => ({ ...prev, verifivationCode: "" }));
    }

    setFieldsData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClear = () => {
    setFieldsData({
      gender: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
      zipCode: "",
      country: "",
      email: "",
      phoneNumber: "",
      verifivationCode: "",
      cardNumber: "",
      promotionChanel1: "",
      promotionChanel2: "",
      branch: "tbilisi",
      region: "",
      city: "",
    });
    setOtpHash("");
    setIsVerified(false);
    setToggleCode(false);
  };

  // ------------------- SEND OTP -------------------
  const handleGetCode = async (e) => {
    e.preventDefault();

    try {
      const formattedPhone = fieldsData.phoneNumber.startsWith("995")
        ? fieldsData.phoneNumber
        : `995${fieldsData.phoneNumber.replace(/^0/, "")}`;

      const res = await fetch("http://localhost:5000/api/sms/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: formattedPhone }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Error sending code");
        return;
      }

      // cooldown timer
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setOtpHash(data.hash);
      setToggleCode(true);

      alert("კოდი გაიგზავნა");
    } catch (err) {
      console.error(err);
      alert("ვერ გაიგზავნა კოდი");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const formattedPhone = fieldsData.phoneNumber.startsWith("995")
        ? fieldsData.phoneNumber
        : `995${fieldsData.phoneNumber.replace(/^0/, "")}`;

      const res = await fetch("http://localhost:5000/api/sms/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          hash: otpHash,
          code: fieldsData.verifivationCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsVerified(true);
        setToggleCode(false); // hide verify button
        alert("კოდი სწორია ✔");
      } else {
        alert("კოდი არასწორია ❌");
      }
    } catch (err) {
      console.error(err);
      alert("ვერ მოხერხდა ვალიდაცია");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Required fields
    if (!fieldsData.gender) newErrors.gender = true;
    if (!fieldsData.firstName.trim()) newErrors.firstName = true;
    if (!fieldsData.lastName.trim()) newErrors.lastName = true;
    if (!fieldsData.dateOfBirth) newErrors.dateOfBirth = true;
    if (!fieldsData.phoneNumber.trim()) newErrors.phoneNumber = true;
    if (!fieldsData.cardNumber.trim()) newErrors.cardNumber = true;

    // OTP Verification
    if (!isVerified) newErrors.verifivationCode = true;

    setErrors(newErrors);

    console.log("Submitting →", fieldsData, errors);

    if (Object.keys(newErrors).length > 0) {
      alert("გთხოვთ შეავსოთ მონიშნული ველები");
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage("");

      const req = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldsData),
      });

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

  return (
    <div className="relative">
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm w-full">
            <div className="text-green-600 text-5xl mb-3">✔</div>
            <h3 className="text-xl font-semibold mb-2">
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
          className="fixed w-full h-full flex justify-center bg-stone-900/30 p-3 sm:py-9"
          onClick={handleShowTerms}
        >
          <div className="relative max-w-[900px] bg-[#fff] px-5 pb-5 overflow-y-scroll rounded">
            <div className="flex flex-row justify-between bg-[#fff] py-5 sticky top-0">
              <h4 className="text-xl font-bold ">წესები და პირობები</h4>
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
                  წესებსა და პირობებზე თანხმობით თქვენ კომპანია „შპს არჩევანი“
                  ს/კ 445389749, იურიდიული მისამართი: თბილისი, პეკინის #5
                  ფაქტობრივი
                </li>
                <li>
                  <span>1.1 </span>
                  კანონმდებლობის შესაბამისად, შეაგროვოს, შეინახოს და დაამუშავოს
                  პერსონალური მონაცემები იმ მიზნ(ები)სათვის, რომლებიც
                  განსაზღვრულია წესებსა და პირობებში.
                </li>
                <li>
                  <p>
                    <span>2. </span>
                    პერსონალურ მონაცემებად განისაზღვრება:
                    <br /> სახელი
                    <br /> ტელეფონის ნომერი
                    <br />
                    პირადი ნომერი (საჭიროებისამებრ)
                    <br /> პერსონალური მონაცემების შეგროვებას, შენახვას და
                    დამუშავებას შპს „შპს არჩევანი“ ახორციელებს მარკეტინგული და
                    მომსახურების გაუმჯობესების მიზნებისთვის, მომხმარებლისთვის
                    ინფორმაციების გაზიარებისა და შეთავაზებების გაგზავნისთვის.
                  </p>
                </li>
                <li>
                  <span>2. </span>
                  კანონმდებლობის შესაბამისად, შეაგროვოს, შეინახოს და დაამუშავოს
                  პერსონალური მონაცემები იმ მიზნ(ები)სათვის, რომლებიც
                  განსაზღვრულია წესებსა და პირობებში.
                </li>
                <li>
                  <span>2. </span>
                  კანონმდებლობის შესაბამისად, შეაგროვოს, შეინახოს და დაამუშავოს
                  პერსონალური მონაცემები იმ მიზნ(ები)სათვის, რომლებიც
                  განსაზღვრულია წესებსა და პირობებში.
                </li>
                <li>
                  <span>2. </span>
                  კანონმდებლობის შესაბამისად, შეაგროვოს, შეინახოს და დაამუშავოს
                  პერსონალური მონაცემები იმ მიზნ(ები)სათვის, რომლებიც
                  განსაზღვრულია წესებსა და პირობებში.
                </li>
                <li>
                  <span>2. </span>
                  კანონმდებლობის შესაბამისად, შეაგროვოს, შეინახოს და დაამუშავოს
                  პერსონალური მონაცემები იმ მიზნ(ები)სათვის, რომლებიც
                  განსაზღვრულია წესებსა და პირობებში.
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
              <img src="/kiabi-logo1.jpg" alt="Kiabi logo" className="h-24" />
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
                  <h5 className="text-2xl text-center font-Roboto">
                    LOYALTY CARD
                  </h5>

                  <p className="text-center text-slate-600">
                    Registration Form
                  </p>
                </div>
                <div className="flex flex-row gap-4">
                  <div>
                    <p>Gender: </p>
                  </div>
                  {["female", "male", "other"].map((g) => (
                    <label key={g} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={fieldsData.gender === g}
                        onChange={handleChange}
                        required
                        className={`border px-2 py-1 rounded flex-1 
  ${errors.gender ? "border-red-500" : "border-gray-300"}`}
                      />
                      {g === "female"
                        ? "Female"
                        : g === "male"
                        ? "Male"
                        : "Other"}
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-4 md:flex-row ">
                  <div className="flex flex-col gap-2 md:w-[150px]">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className={`border px-2 py-1 rounded flex-1 
  ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                      value={fieldsData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="border px-2 py-1 rounded flex-1"
                      value={fieldsData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="dateOfBirth">Birth Date *</label>
                  <input
                    id="dateOfBirth"
                    className="border rounded px-2 py-1"
                    name="dateOfBirth"
                    type="date"
                    value={fieldsData.dateOfBirth}
                    onChange={handleChange}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="address">Address *</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row  gap-5">
                  <div className="flex flex-col flex-1 gap-2">
                    <label htmlFor="country">City *</label>
                    {/* <input
                      id="country"
                      name="country"
                      type="text"
                      className="border px-2 py-1 rounded flex-1"
                      value={fieldsData.country}
                      onChange={handleChange}
                    /> */}
                    <RegionCitySelect
                      fieldsData={fieldsData}
                      setFieldsData={setFieldsData}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-[150px]">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      className="border px-2 py-1 rounded flex-1"
                      value={fieldsData.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="country">Country *</label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.country}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <input
                    placeholder="XXX-XXX-XXX-XXXXX"
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phoneNumber">Mobile *</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="Tel"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-row  gap-2 pt-1">
                  <div className="flex flex-1">
                    {/* <label htmlFor="">მობილურის ნომერი</label> */}
                    <input
                      name="verifivationCode"
                      type="text"
                      value={fieldsData.verifivationCode}
                      onChange={handleChange}
                      className={`border px-2 py-1 rounded flex-1
    ${
      isVerified
        ? "border-green-500"
        : errors.verifivationCode
        ? "border-red-500"
        : "border-gray-300"
    }`}
                    />
                  </div>
                  {!toggleCode && (
                    <button
                      type="button"
                      disabled={cooldown > 0}
                      onClick={handleGetCode}
                      className={`px-5 py-1 rounded text-white  
    ${cooldown > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600"}`}
                    >
                      {cooldown > 0 ? `გაიმეორეთ (${cooldown})` : "Code"}
                    </button>
                  )}
                  {toggleCode && (
                    <button
                      className="bg-green-600 px-5 py-1 rounded text-stone-50"
                      type="button"
                      onClick={handleVerifyCode}
                    >
                      Verify
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p htmlFor="">I wish to recive kiabi news:</p>
                  <div className="flex flex-col items-start justify-center gap-3">
                    <div className="flex items-center gap-3">
                      <p>By SMS:</p>
                      <div className="flex flex-row gap-2">
                        <label htmlFor="promotionChanel1-1">Yes</label>
                        <input
                          id="promotionChanel1-1"
                          name="promotionChanel1"
                          type="radio"
                          className="border px-2 py-1 rounded"
                          value={true}
                          onChange={handleChange}
                          required
                        />{" "}
                      </div>
                      <div className="flex flex-row gap-2">
                        <label htmlFor="promotionChanel1-2">No</label>
                        <input
                          id="promotionChanel1-2"
                          name="promotionChanel1"
                          type="radio"
                          className="border px-2 py-1 rounded"
                          value={false}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p>By EMail:</p>{" "}
                      <div className="flex flex-row gap-2">
                        <label htmlFor="promotionChanel2-1">Yes</label>
                        <input
                          id="promotionChanel2-1"
                          name="promotionChanel2"
                          type="radio"
                          className="border px-2 py-1 rounded "
                          value={true}
                          onChange={handleChange}
                          required
                        />{" "}
                      </div>
                      <div className="flex flex-row gap-2">
                        <label htmlFor="promotionChanel2-2">No</label>
                        <input
                          id="promotionChanel2-2"
                          name="promotionChanel2"
                          type="radio"
                          className="border px-2 py-1 rounded "
                          value={false}
                          onChange={handleChange}
                          required
                        />{" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <input type="checkbox" value="agree" required />
                  <p>
                    I read and agree to 
                    <span
                      className="text-blue-400 cursor-pointer underline ps-1"
                      onClick={handleShowTerms}
                      id="open-terms"
                    >
                      terms and conditions
                    </span>
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    type="button"
                    className="bg-slate-300 py-2 px-3 rounded"
                    onClick={handleClear}
                  >
                    Clear
                  </button>

                  <button
                    type="submit"
                    className="bg-blue-500 py-2 px-3 rounded flex-1 text-slate-50 disabled:bg-gray-400"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Submit"}
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
