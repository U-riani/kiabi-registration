import React, { useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HomePage = () => {
  const [fieldsData, setFieldsData] = useState({
    gender: "",
    firstName: "",
    lastName: "",
    date: "",
    address: "",
    zipCode: "",
    country: "",
    email: "",
    phoneNumber: "",
    cardNumber: "",
    promotionChanels: "",
  });
  const [showTerms, setShowTerms] = useState(false);

  const handleShowTerms = (e) => {
    if (e.target && e.target.id.includes("open-terms")) {
      setShowTerms((prev) => !prev);
    }
    if (e.target && e.target.closest("#close-terms")) {
      setShowTerms(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldsData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(fieldsData);
  };
  const handleClear = () => {
    setFieldsData({
      gender: "",
      firstName: "",
      lastName: "",
      date: "",
      address: "",
      zipCode: "",
      country: "",
      email: "",
      phoneNumber: "",
      verifivationCode: "",
      cardNumber: "",
      promotionChanels: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(fieldsData);
  };

  return (
    <div className="relative">
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
          <div className="flex flex-col gap-5 bg-[#fff] rounded  p-5 sm:p-7  xl:p-10 border border-slate-300 rounded shadow-2xl">
            <div className="flex justify-center items-center">
              <img src="/kiabiLogo.jpeg" alt="Kiabi logo" className="h-15" />
            </div>
            <div>
              <form className="flex flex-col gap-4 bg-[#fff] font-Roboto w-full max-w-[800px] p-5 sm:p-7 xl:p-10 shadow-xl border border-neutral-200 rounded ">
                <div className="mb-5">
                  <h5 className="text-2xl font-Roboto">ლოიალურობის ბარათი</h5>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-row item-center justify-center gap-1">
                    <p className="pe-3">სქესი:</p>
                    <input
                      name="gender"
                      type="radio"
                      value="female"
                      checked={fieldsData.gender == "female"}
                      onChange={handleChange}
                    />
                    <label>ქალი</label>
                  </div>
                  <div className="flex flex-row item-center justify-center gap-1">
                    <input
                      value="male"
                      name="gender"
                      type="radio"
                      checked={fieldsData.gender == "male"}
                      onChange={handleChange}
                    />
                    <label>მამაკაცი</label>
                  </div>
                  <div className="flex flex-row item-center justify-center gap-1">
                    <input
                      value="other"
                      name="gender"
                      type="radio"
                      checked={fieldsData.gender == "other"}
                      onChange={handleChange}
                    />
                    <label>სხვა</label>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName">სახელი</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName">გვარი</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="date">დაბადების თარიღი</label>
                  <input
                    id="date"
                    className="border rounded px-2 py-1"
                    name="date"
                    type="date"
                    value={fieldsData.date}
                    onChange={handleChange}
                    onClick={(e) =>
                      e.target.showPicker && e.target.showPicker()
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="address">მისამართი</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="zipCode">ZIP კოდი(არასავალდებულო)</label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.zipCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="country">ქვეყანა</label>
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
                  <label htmlFor="email">მეილი</label>
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
                  <label htmlFor="cardNumber">ბარათის კოდი</label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.cardNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phoneNumber">მობილურის ნომერი</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="Tel"
                    className="border px-2 py-1 rounded flex-1"
                    value={fieldsData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-row  gap-2 pt-1">
                  <div className="flex flex-1">
                    {/* <label htmlFor="">მობილურის ნომერი</label> */}
                    <input
                      name="verifivationCode"
                      type="text"
                      className="border px-2 py-1 rounded flex-1"
                      value={fieldsData.verifivationCode}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    className="bg-orange-600 px-5 py-1 rounded text-stone-50"
                    type="button"
                  >
                    კოდი
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <p htmlFor="">გინდათ თუ არა მიიღოთ მარკეტინგული სიახლეები:</p>
                  <div className="flex flex-row-reverse items-center justify-end gap-2">
                    <label>SMS შეტყიბინენებით</label>
                    <input
                      name="promotionChanels"
                      type="checkbox"
                      className="border px-2 py-1 rounded"
                      value="sms"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-row-reverse items-center justify-end gap-2">
                    <label>EMail-ით</label>
                    <input
                      name="promotionChanels"
                      type="checkbox"
                      className="border px-2 py-1 rounded "
                      value="sms"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <input type="checkbox" value="agree" />
                  <p>
                    გავეცანი და თანხმობას ვაცხადებ{" "}
                    <span
                      className="text-blue-400 cursor-pointer underline"
                      onClick={handleShowTerms}
                      id="open-terms"
                    >
                      წესებზე და პირობებზე
                    </span>
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    className="bg-slate-300 py-2 px-3 rounded"
                    onClick={handleClear}
                  >
                    გასუფთავება
                  </button>
                  <button
                    className="bg-blue-500 py-2 px-3 rounded flex-1 text-slate-50"
                    onClick={handleSubmit}
                  >
                    გაგზავნა
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
