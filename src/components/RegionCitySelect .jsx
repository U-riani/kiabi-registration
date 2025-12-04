import { useState, useRef, useEffect } from "react";

const RegionCitySelect = ({ fieldsData, setFieldsData }) => {
  const regions = [
    "ბათუმი","გონიო","კვარიათი","სარფი","ქობულეთი","ჩაქვი","ხულო","მახინჯაური","ხელვაჩაური",
    "ოზურგეთი","ლანჩხუთი","ჩოხატაური","უგუნძა","გურია","გურია, შეკვეთილი","ურეკი",
    "ქუთაისი","ზესტაფონი","ხელითური","ტყიბილი","საჩხერე","ხონი","ჭიათურა","წყალტუბო","ვანი",
    "ბაღდათი","სამტრედია","სტეფანწმინდა",
    "თელავი","ლაგოდეხი","ყვარელი","გურჯაანი","საგარეჯო","სიღნაღი","ახმეტა","თიანეთი",
    "წინანდალი","ლოპოტა","კისისხევი",
    "მცხეთა","ქარელი","გუდაური","სტეფანწმინდა","ხდელი","გუდამაყარი","ზეცხდა","ნატახტარი",
    "ზუგდიდი","სენაკი","მარტვილი","ჩხოროწყუ","ხობი","ანაკლია","ჭუბერი","მესტია",
    "ამბროლაური","ონი","ცაგერი","ლენტეხი",
    "გარდაბანი","რუსთავი","მარნეული","დედოფლისწყარო","დმანისი","ბოლნისი","წითელი ხიდი",
    "სადახლო","გორი","კასპი","ქარელი","ხაშური","ურეკი","ტინისხიდი",
    "ახალციხე","ახალქალაქი","ასპინძა","ბაკურიანი","ბორჯომი","ნინოწმინდა","ვალე","აბასთუმანი",
    "თეთრიწყარო","მარნეული","დმანისი","ბოლნისი","გარდაბანი","რუსთავი","სარალო",
    "მესტია","თბილისი",
    "ბაკუ","მანგლისი","მარტყოფი","ყვითილწყარო","გრიგოლეთი"
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
