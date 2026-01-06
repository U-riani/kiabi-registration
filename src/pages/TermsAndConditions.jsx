import React from "react";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div>
        <h4 className="text-xl text-center py-5 capitalize font-bold ">
          {t("termsAndConditions")}
        </h4>
      </div>
      <div className="">
        <ol type="1" className="flex flex-col gap-2 mb-2">
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
  );
};

export default TermsAndConditions;
