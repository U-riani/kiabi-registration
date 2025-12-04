import { useState, useRef, useEffect } from "react";

const RegionCitySelect = ({ fieldsData, setFieldsData }) => {
  const regions = [
    "Abastumani",
    "Abasha",
    "Agara",
    "Adigeni",
    "Ambrolauri",
    "Anaklia",
    "Aspindza",
    "Akhaldaba",
    "Akhalkalaki",
    "Akhaltsikhe",
    "Akhmeta",
    "Batumi",
    "Baku",
    "Bakuriani",
    "Baghdati",
    "Bakhmaro",
    "Bolnisi",
    "Borjomi",
    "Gamardzhveba",
    "Gardabani",
    "Gonio",
    "Gori",
    "Grigoleti",
    "Gudamakari",
    "Gudauri",
    "Guria",
    "Guria Shekvetili",
    "Gurjaani",
    "Dedoplistskaro",
    "Dmanisi",
    "Dusheti",
    "Etsari",
    "Vaziani",
    "Vale",
    "Vani",
    "Vardisubani",
    "Zemo Fonichala",
    "Zestafoni",
    "Zugdidi",
    "Tbilisi",
    "Tetritskaro",
    "Telavi",
    "Teleti",
    "Terjola",
    "Tianeti",
    "Kazreti",
    "Kaspi",
    "Kvariati",
    "Kisiskhevi",
    "Lagodekhi",
    "Lanchkhuti",
    "Lentekhi",
    "Lia",
    "Lopota",
    "Manglisi",
    "Marneuli",
    "Martvili",
    "Martkofi",
    "Makhinjauri",
    "Mestia",
    "Mtskheta",
    "Natakhtari",
    "Ninotsminda",
    "Ozurgeti",
    "Oni",
    "Rustavi",
    "Sagarejo",
    "Saguramo",
    "Sadakhlo",
    "Sairme",
    "Samtredia",
    "Sartichala",
    "Sarpi",
    "Saka",
    "Sachkhere",
    "Senaki",
    "Signagi",
    "Stepantsminda",
    "Surami",
    "Tinishkidi",
    "Tkibuli",
    "Urbnisi",
    "Ureki",
    "Poti",
    "Kareli",
    "Keda",
    "Kvemo Fonichala",
    "Kvitiri",
    "Kvesheti",
    "Kobuleti",
    "Kutaisi",
    "Kazbegi",
    "Kvareli",
    "Sharabidzeebi",
    "Shuakhevi",
    "Chakvi",
    "Chokhatauri",
    "Chkhorotsku",
    "Tsageri",
    "Tsaishi",
    "Tsalenjikha",
    "Tsalka",
    "Tsagveri",
    "Tsiteli Khidi",
    "Tsiteltskaro",
    "Tsinandali",
    "Tsnori",
    "Tskaltubo",
    "Chiatura",
    "Kharagauli",
    "Khashuri",
    "Khelvachauri",
    "Khobi",
    "Khoni",
    "Khulo",
  ];

  const dropdownRef = useRef(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered =
    query.trim() === ""
      ? regions
      : regions.filter((city) =>
          city.toLowerCase().startsWith(query.toLowerCase())
        );

  const handleSelect = (city) => {
    setFieldsData((prev) => ({ ...prev, city }));
    setQuery(city);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={dropdownRef}>
      {/* INPUT FIELD */}
      <input
        type="text"
        className="border px-3 py-2 rounded w-full cursor-pointer"
        placeholder="Select city..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onClick={() => setOpen(true)}
        required
      />

      {/* DROPDOWN */}
      {open && (
        <div className="absolute top-full left-0 right-0 max-h-60 bg-white border rounded shadow-lg overflow-y-auto z-50">
          {filtered.length === 0 ? (
            <p className="p-2 text-gray-500 text-sm">No matches...</p>
          ) : (
            filtered.map((city) => (
              <div
                key={city}
                onClick={() => handleSelect(city)}
                className="p-2 cursor-pointer hover:bg-blue-100"
              >
                {city}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RegionCitySelect;
