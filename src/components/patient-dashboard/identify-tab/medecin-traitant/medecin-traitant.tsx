"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomAsyncSelect, CustomInput, CustomLabel, CustomImage, HeadingTag, DynamicHtmlTag } from "@/components";
import {
  selectalreadyHasPractionerUpdate,
  selectPatientDetailsData,
  setalreadyHasPractionerUpdate,
  setPatientDetailsData,
} from "@/store/reducers/patientDetailsSlice";
import { PractitionerListOption, searchPractitionerByPatternApi } from "@/utility";

// Define PractitionerData interface
interface PractitionerData {
  value: string | number; // Practitioner ID (could be string or number)
  label: string; // Full name of the practitioner (e.g., "Dr. John Doe")
  city: string | null; // City name (optional or nullable)
  postCode: string | null; // Postal code (optional or nullable)
}

const MedecinTraitantTab = () => {
  const dispatch = useDispatch();
  const fetchPatientData = useSelector(selectPatientDetailsData);
  const alreadyHasPractionerUpdate = useSelector(selectalreadyHasPractionerUpdate);

  const [createMedicalData, setCreateMedicalData] = useState<{
    personalPractitioner: PractitionerData | null;
    personalPractitionerCity: string;
    personalPractitionerPostcode: string;
  }>({
    personalPractitioner: null,
    personalPractitionerCity: "",
    personalPractitionerPostcode: "",
  });

  const [searchPractitionerList, setSearchPractitionerList] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false); // Track checkbox state

  // Set practitioner data based on fetchPatientData
  useEffect(() => {
    const practitioner = fetchPatientData?.patientData?.personalPractitioner;
    if (practitioner) {
      const fullName = `${practitioner.firstName} ${practitioner.lastName}`;
      const selectedPractitioner = {
        value: practitioner.id,
        label: fullName,
        city: practitioner.city?.cityName,
        postCode: practitioner.city?.cityZipCode,
      };
      setCreateMedicalData({
        personalPractitioner: selectedPractitioner,
        personalPractitionerCity: selectedPractitioner.city,
        personalPractitionerPostcode: selectedPractitioner.postCode,
      });
      setCheckboxChecked(false); // Unchecked if a practitioner exists
    } else {
      setCreateMedicalData({
        personalPractitioner: null,
        personalPractitionerCity: "",
        personalPractitionerPostcode: "",
      });
      setCheckboxChecked(true); // Checked if no practitioner exists
    }
  }, [fetchPatientData?.patientData?.personalPractitioner]); // Depend on only personalPractitioner

  // Handle checkbox toggle
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setCheckboxChecked(isChecked);

    if (isChecked) {
      // Clear practitioner fields and disable them when checked
      setCreateMedicalData({
        personalPractitioner: null,
        personalPractitionerCity: "",
        personalPractitionerPostcode: "",
      });
    }

    // Update patient data in Redux with checkbox state
    const updatedPatient = {
      ...alreadyHasPractionerUpdate,
      alreadyHasPractioner: !isChecked, // Set true when unchecked (has practitioner), false when checked (no practitioner)
      personalPractitioner: isChecked ? null : fetchPatientData.patientData.personalPractitioner,
    };
    dispatch(setalreadyHasPractionerUpdate(updatedPatient));
  };

  const handlePractitionerChange = async (practitionerObject: PractitionerListOption | null) => {
    setCreateMedicalData((prevState: any) => ({
      ...prevState,
      personalPractitioner: practitionerObject,
      personalPractitionerCity: practitionerObject?.city ?? "",
      personalPractitionerPostcode: practitionerObject?.postCode ?? "",
    }));

    const updatedPatient = {
      ...alreadyHasPractionerUpdate,
      personalPractitioner: practitionerObject?.value,
    };

    dispatch(setalreadyHasPractionerUpdate(updatedPatient));
  };

  // Search practitioners by pattern
  const searchPractitionersByPattern = async (search: any) => {
    if (search.length < 3) {
      return [];
    }

    try {
      const data = await searchPractitionerByPatternApi(0, 25, search);
      const practitioners = data.data.results.map((practitioner: any) => ({
        value: practitioner.id,
        label: `${practitioner.firstName} ${practitioner.lastName}`,
        firstName: practitioner.firstName,
        lastName: practitioner.lastName,
        city: practitioner?.city?.cityName,
        postCode: practitioner?.city?.cityZipCode,
      }));
      setSearchPractitionerList(practitioners);
      return practitioners;
    } catch (error) {
      return [];
    }
  };
  return (
    <DynamicHtmlTag type="div" className="w-full">
      <DynamicHtmlTag type="div" className="lg:bg-sky-100 mb-5 lg:mb-2 p-1 sticky top-0 z-10">
        <HeadingTag type="h5" className="text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-snug lg:text-center text-customBlue uppercase">
          MÉDECIN TRAITANT
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="lg:px-2 xl:px-2 2xl:px-4 lg:py-2 pt-0">
        <DynamicHtmlTag type="div" className="flex flex-col mt-2 xl:mt-0">
          <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none">
            Médecin traitant
          </CustomLabel>
          <CustomAsyncSelect
            name="personalPractitionerId"
            value={createMedicalData.personalPractitioner}
            onChange={handlePractitionerChange}
            defaultOptions={searchPractitionerList}
            loadOptions={searchPractitionersByPattern}
            placeholder="Rechercher un médecin"
            isDisabled={checkboxChecked} // Disable if checkbox is checked
            isClearable
            cacheOptions
            noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucun médecin n’a été trouvé")}
            className="timing-select outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs xl:leading-none rounded-md border border-gray-200"
          />
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="flex mt-2 2xl:mt-4 gap-x-2">
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none">Ville</CustomLabel>
            <CustomInput
              type="text"
              name="personalPractitionerCity"
              value={createMedicalData?.personalPractitionerCity}
              disabled={checkboxChecked} // Disable if checkbox is checked
              placeholder="Ville"
              className="outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none rounded-md border border-gray-200 py-1 px-2 w-full"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex flex-col w-1/2">
            <CustomLabel className="pb-1 ps-2 text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none">
              Code postal
            </CustomLabel>
            <CustomInput
              type="text"
              name="personalPractitionerPostcode"
              value={createMedicalData?.personalPractitionerPostcode}
              disabled={checkboxChecked} // Disable if checkbox is checked
              placeholder="Code postal"
              className="outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs 2xl:leading-tight xl:leading-none rounded-md border border-gray-200 py-1 px-2 w-full"
            />
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div">
          <DynamicHtmlTag type="div" className="cstm-form-group flex items-center my-2 xl:mb-0">
            <DynamicHtmlTag type="div" className="custom-checkbox [&&]:flex items-center gap-2">
              <CustomInput
                className="input-checked"
                type="checkbox"
                id="amasddnan"
                checked={checkboxChecked}
                onChange={handleCheckboxChange} // Handle checkbox change
              />
              <CustomLabel className="[&&]:min-w-[15px] [&&]:min-h-[15px] [&&]:w-[15px] [&&]:h-[15px]" htmlFor="amasddnan">
                <CustomImage src="/images/checkbox-img.svg" alt="checkbox" width={100} height={100} className="checkmark w-full" />
              </CustomLabel>
            </DynamicHtmlTag>
            <CustomLabel className="ps-3 text-2xs lg:text-3xs 2xl:text-xs 2xl:leading-tight xl:leading-none font-normal cstm-lable">
              Je n&apos;ai pas de médecin traitant
            </CustomLabel>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        <CustomImage src="/images/dr-avtar.svg" alt="dr-avtar" width={160} height={150} className="m-auto mt-6 lg:hidden" />
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default MedecinTraitantTab;
