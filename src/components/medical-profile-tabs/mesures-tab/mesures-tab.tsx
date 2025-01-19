"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  CustomButton,
  CustomDatePicker,
  CustomFullScreenLoader,
  CustomImage,
  CustomInput,
  CustomLabel,
  CustomModal,
  CustomSelect,
  DynamicHtmlTag,
  EmptyHistory,
  HeadingTag,
  VisioLogo,
} from "@/components";
import { IoCloseSharp } from "react-icons/io5";
import {
  addHeightApi,
  AddHeightSchema,
  addWeightApi,
  AddWeightSchema,
  formatToTwoDecimalPlaces,
  getFormateDate,
  getListheightApi,
  getListimcApi,
  getListWeightApi,
  MedicalProfileMesure,
  MesureHeightType,
  MesureIMCType,
  MesureWeightType,
} from "@/utility";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { RootState } from "@/store";
import ChartBox from "@/components/chartsbox/chartsbox";
import { selectPatientDetailsData } from "@/store/reducers/patientDetailsSlice";
const createMesureParams = {
  patientId: "",
  startDate: "",
  weight: "",
  height: "",
};
const Mesures = () => {
  const [MesureModalOpen, MesureIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const loggedInUser = useSelector(selectLoginResponse);
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [medicalProfileMesure, setmedicalProfileMesure] = useState<MedicalProfileMesure>(createMesureParams);
  const [errors, setErrors] = useState<MedicalProfileMesure>();
  const [registerError, setRegisterError] = useState<string>("");
  const [Weightlist, setWeight] = useState<MesureWeightType[]>([]);
  const [Heightlist, setHeight] = useState<MesureHeightType[]>([]);
  const [chartDatas, setChartDatas] = useState<any[]>([]);
  const [imcData, setIMCData] = useState<any>(null);
  const fetchPatientData = useSelector(selectPatientDetailsData);

  const fetchWeightList = useCallback(async () => {
    try {
      const data = await getListWeightApi(fetchPatientData?.id);
      setWeight(data?.data?.results || []);
    } catch (error) {}
  }, [fetchPatientData?.id]);

  const fetchHeightList = useCallback(async () => {
    try {
      const data = await getListheightApi(fetchPatientData?.id);
      setHeight(data?.data?.results || []);
    } catch (error) {}
  }, [fetchPatientData?.id]);
  const fetchHeightimcList = useCallback(async () => {
    try {
      const data = await getListimcApi(fetchPatientData?.id);
      if (data?.data) {
        const { height, weight, imc, idealWeight } = data.data;
        const chartData = calculateBMIChartData(height, weight, imc, idealWeight);
        setIMCData(data.data);
        setChartDatas(chartData);
      }
    } catch (error) {}
  }, [fetchPatientData?.id]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("medical-profile"));
      try {
        await fetchWeightList();
        await fetchHeightList();
        await fetchHeightimcList();
      } catch (err) {
      } finally {
        dispatch(hideLoader());
      }
    };
    fetchData();
  }, [fetchWeightList]);

  // EditModalBox
  const openPoidsModal = () => {
    MesureIsModalOpen(true);
    setModalMode("edit");
  };
  const openTailleModal = () => {
    MesureIsModalOpen(true);
    setModalMode("add");
  };

  const closeMesureModal = () => {
    setmedicalProfileMesure(createMesureParams);
    setStartDate(undefined);
    setRegisterError("");
    MesureIsModalOpen(false);
    setErrors(createMesureParams);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const key = modalMode === "edit" ? "weight" : "height";

    setmedicalProfileMesure(prevState => ({
      ...prevState,
      [key]: value,
    }));

    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [key]: undefined,
    }));
  };

  const handleDateOptionChange = (date: any) => {
    const formattedDate = date ? getFormateDate(date, "YYYY-MM-DD") : "";

    setStartDate(date);
    setmedicalProfileMesure((prevState: MedicalProfileMesure) => ({
      ...prevState,
      startDate: formattedDate,
    }));
    setErrors((prevErrors: any) => ({ ...prevErrors, startDate: undefined }));
  };
  const handleSubmit = async () => {
    const payload = {
      patientId: fetchPatientData?.id,
      startDate: medicalProfileMesure.startDate, // Ensure startDate is of type `string`
      weight: medicalProfileMesure.weight,
    };

    const payload2 = {
      patientId: fetchPatientData?.id,
      startDate: medicalProfileMesure.startDate, // Ensure startDate is of type `string`
      height: medicalProfileMesure.height,
    };

    try {
      dispatch(showLoader("update-patient"));
      setRegisterError("");
      if (modalMode === "edit") {
        await AddWeightSchema.validate(payload, { abortEarly: false });
        await addWeightApi(payload);
        fetchWeightList();
      }

      if (modalMode === "add") {
        await AddHeightSchema.validate(payload2, { abortEarly: false });
        await addHeightApi(payload2);
        fetchHeightList();
      }

      setmedicalProfileMesure(createMesureParams);
      setStartDate(undefined);
      MesureIsModalOpen(false);
      setErrors(createMesureParams);
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce(
          (acc: any, { path, message }: any) => ({
            ...acc,
            [path]: message,
          }),
          {}
        );
        setErrors(validationErrors);
      }

      let errorMessage = err.response?.data?.message;
      setRegisterError(errorMessage);
    } finally {
      dispatch(hideLoader());
    }
  };

  const formatChartData = (data: any[]) => {
    return data.map(item => ({
      name: item.startDate, // X-axis label as startDate
      value: item.weight, // Y-axis value as weight
    }));
  };
  // Format the data for the chart
  const chartData = formatChartData(Weightlist);

  const formatChartDataHeight = (data: any[]) => {
    return data.map(item => ({
      name: item.startDate, // X-axis label as startDate
      value: item.height, // Y-axis value as weight
    }));
  };
  // Format the data for the chart
  const chartDataHeight = formatChartDataHeight(Heightlist);

  const calculateBMIChartData = (height: number, weight: number, imc: number, idealWeight: number) => {
    const heightInMeters = height / 100;
    const bmiData = [
      { name: "Insuffisance Pondérale", minBMI: 0, maxBMI: 18.5, color: "#ADD8E6" },
      { name: "Poids Idéal", minBMI: 18.5, maxBMI: 24.9, color: "#90EE90" },
      { name: "Surpoids", minBMI: 25, maxBMI: 29.9, color: "#FFD700" },
      { name: "Obésité Niveau I", minBMI: 30, maxBMI: 34.9, color: "#FFA07A" },
      { name: "Obésité Niveau II", minBMI: 35, maxBMI: 39.9, color: "#FF6347" },
      { name: "Obésité Sévère", minBMI: 40, maxBMI: 60, color: "#FF4500" }, // You capped maxBMI here to 60 instead of Infinity
    ];

    const weightRanges = bmiData.map(zone => {
      // Calculate weight for minBMI and maxBMI to determine the weight range for this zone
      const weightMinBMI = Math.round(zone.minBMI * heightInMeters * heightInMeters);
      const weightMaxBMI = Math.round(zone.maxBMI * heightInMeters * heightInMeters);

      return {
        name: zone.name,
        value: (weightMinBMI + weightMaxBMI) / 2, // Average the min and max weight for the zone
        color: zone.color,
      };
    });

    // Add current BMI point
    weightRanges.push({ name: "Votre IMC", value: weight, color: "#FF1493" });

    return weightRanges;
  };

  // log
  return (
    <DynamicHtmlTag type="div" className="bg-white rounded-xl h-[90%] xl:h-[88%] 2xl:h-[98%]">
      <DynamicHtmlTag type="div" className="bg-gradient-to-t from-[#ED6B55] to-[#F5D93E] rounded-t-xl pt-0">
        <HeadingTag type="h3" className="font-semibold text-sm text-white text-center py-1 px-3">
          Mesures (Poids, taille, IMC)
        </HeadingTag>
      </DynamicHtmlTag>
      {/* Tab Content Screen */}
      {isLoading ? (
        <CustomFullScreenLoader />
      ) : (
        <DynamicHtmlTag type="div" className="w-full px-3 py-2 relative h-full main-tab-inner overflow-auto">
          <DynamicHtmlTag type="div">
            <DynamicHtmlTag type="div" className="flex items-center justify-between gap-3">
              <CustomLabel className="text-2xs font-semibold">Poids</CustomLabel>
              <CustomButton
                as="button"
                onClick={openPoidsModal}
                className={`text-2xs 2xl:text-xs cstm-btn flex py-1 px-1 xl:px-4 ms-0 md:ms-4 me-3 md:me-0 justify-center w-2/6 md:w-auto view-more-btn rounded-full text-white font-semibold`}>
                Ajouter
              </CustomButton>
            </DynamicHtmlTag>
            {Weightlist?.length == 0 ? (
              <DynamicHtmlTag type="span" className="block mx-auto max-w-max text-center text-2xs lg:text-xs py-1 empty-image-main">
                <CustomImage src={VisioLogo} alt="logo" className="loader-logo mx-auto mb-2 w-4/12" width={500} height={200} />
                Aucune mesure de poids n{"'"}a été enregistrée pour le moment.
              </DynamicHtmlTag>
            ) : (
              <ChartBox
                chartType="lineweight"
                title="Poids"
                chartData={chartData} // Example data: [{ name: '01/01/2023', value: 80 }, ...]
                isSuccess={true}
                bottomText="Date"
              />
            )}
            <DynamicHtmlTag type="div" className="flex items-center justify-between gap-3 my-3">
              <CustomLabel className="text-2xs font-semibold">Taille</CustomLabel>
              <CustomButton
                as="button"
                onClick={openTailleModal}
                className={`text-2xs 2xl:text-xs cstm-btn flex py-1 px-1 xl:px-4 ms-0 md:ms-4 me-3 md:me-0 justify-center w-2/6 md:w-auto view-more-btn rounded-full text-white font-semibold`}>
                Ajouter
              </CustomButton>
            </DynamicHtmlTag>
            {Heightlist?.length == 0 ? (
              <DynamicHtmlTag type="span" className="block mx-auto max-w-max text-center text-2xs lg:text-xs py-1 empty-image-main mb-5">
                <CustomImage src={VisioLogo} alt="logo" className="loader-logo mx-auto mb-2 w-4/12" width={500} height={200} />
                Aucune mesure de taille n{"'"}a été enregistrée pour le moment.
              </DynamicHtmlTag>
            ) : (
              <ChartBox
                chartType="lineHeight"
                title="Taille"
                chartData={chartDataHeight} // Example data: [{ name: '01/01/2023', value: 80 }, ...]
                isSuccess={true}
                bottomText="Date"
              />
            )}
            {/* <CustomImage src="/images/taille-graph.svg" alt="poids-graph" width={800} height={300} className="mt-2 w-full" /> */}
            <DynamicHtmlTag type="div" className="flex items-center justify-center gap-3">
              <CustomLabel className="text-2xs font-semibold">IMC</CustomLabel>
              <DynamicHtmlTag type="div" className="text-pink-500 font-semibold">
                <CustomLabel className="border border-gray-300 p-2 rounded-sm text-xs">{formatToTwoDecimalPlaces(imcData?.imc)}</CustomLabel>
                <DynamicHtmlTag type="span" className="text-xs px-2">
                  poids ideal
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            {imcData?.length == 0 ? (
              <DynamicHtmlTag type="span" className="block mx-auto max-w-max text-center text-2xs lg:text-xs py-1 empty-image-main">
                <CustomImage src={VisioLogo} alt="logo" className="loader-logo mx-auto mb-2 w-4/12" width={500} height={200} />
                Aucune mesure de imc n{"'"}a été enregistrée pour le moment.
              </DynamicHtmlTag>
            ) : (
              <ChartBox chartType="BMIChart" title="IMC" chartData={chartDatas} isSuccess={!!imcData} />
            )}
            {/* <CustomImage src="/images/imc-graph.svg" alt="poids-graph" width={800} height={300} className="mt-2 w-full" /> */}
          </DynamicHtmlTag>

          {/* Add Mesures Modal Box Start */}
          <CustomModal isOpen={MesureModalOpen} onClose={closeMesureModal} modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
            <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-indigo-500 to-sky-500 p-0 pt-4">
              <DynamicHtmlTag type="div" className="bg-base-100 px-6 gap-y-5 flex flex-col py-4">
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <DynamicHtmlTag type="div" className="flex items-center justify-between gap-2 mb-4">
                    <HeadingTag type="h2" className="text-blue font-bold text-lg">
                      {modalMode === "edit" ? "Ajouter un Poids" : "Ajouter un Taille"}
                    </HeadingTag>
                    <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={closeMesureModal}>
                      <IoCloseSharp className="w-5 h-5" />
                    </CustomButton>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div">
                    <DynamicHtmlTag type="div" className="mt-4">
                      <DynamicHtmlTag type="div" className="flex justify-between items-center w-11/12 lg:w-8/12">
                        <CustomLabel className="text-xs ps-2">
                          {modalMode === "edit" ? "Poids" : "Taille"}{" "}
                          <DynamicHtmlTag type="span" className="text-red-500">
                            *
                          </DynamicHtmlTag>
                        </CustomLabel>
                        <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                          {errors?.height
                            ? errors?.height
                            : errors?.weight && <DynamicHtmlTag type="div">{errors?.height ? errors?.height : errors?.weight}</DynamicHtmlTag>}
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="div" className="flex w-full items-center gap-x-3">
                        <CustomInput
                          type="number"
                          placeholder={modalMode === "edit" ? "Entrez le poids" : "Entrez le taille"}
                          value={modalMode === "edit" ? medicalProfileMesure.weight : medicalProfileMesure.height}
                          onChange={handleInputChange}
                          className={`${errors?.height ? "border-red-400" : "border-gray-400"} ${errors?.weight ? "border-red-400" : "border-gray-400"} [&&]:text-2xs font-semibold w-11/12 lg:w-8/12 block rounded-md outline-none border  px-4 py-2 h-[2.063rem] `}
                        />
                        <DynamicHtmlTag type="span" className="text-xs font-semibold text-gray-400">
                          {modalMode === "edit" ? "kg" : "cm"}
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="mt-16">
                      <DynamicHtmlTag type="div" className="flex justify-between items-center w-full lg:w-8/12">
                        <CustomLabel className="text-xs px-2">
                          Date de début{" "}
                          <DynamicHtmlTag type="span" className="text-red-500">
                            *
                          </DynamicHtmlTag>
                        </CustomLabel>
                        {errors?.startDate && (
                          <DynamicHtmlTag type="div" className="text-red-500 text-[9px]">
                            {errors?.startDate}
                          </DynamicHtmlTag>
                        )}
                      </DynamicHtmlTag>
                      <DynamicHtmlTag
                        type="div"
                        className={`${errors?.startDate ? "border-red-400" : "border-gray-400"} h-[2.063rem] form-date-picker date-picker items-center leading-1 font-semibold w-full lg:w-8/12 block outline-none rounded-md border  py-2 px-2`}>
                        <DynamicHtmlTag type="span" className="text-2xs w-full block">
                          <CustomDatePicker
                            placeholderText="jj/mm/aaaa"
                            selected={startDate}
                            onChange={(date: any) => handleDateOptionChange(date)}
                            dateFormat={"dd/MM/yyyy"}
                          />
                        </DynamicHtmlTag>
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="mt-5 flex justify-end">
                      <CustomButton
                        onClick={handleSubmit}
                        as="button"
                        className="w-2/5 lg:w-2/6 card-btn text-2xs 2xl:text-xs text-white py-2 px-3 font-semibold rounded-full">
                        Ajouter
                      </CustomButton>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>

                  {registerError && (
                    <DynamicHtmlTag type="div" className="text-red-500 font-semibold text-2xs mt-1">
                      {registerError}
                    </DynamicHtmlTag>
                  )}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </CustomModal>
          {/*Add Mesures Modal Box End */}
        </DynamicHtmlTag>
      )}
      {/* Empty Screen Without Content */}
      <DynamicHtmlTag type="div" className="empty-history-content h-full hidden">
        <EmptyHistory
          title="Vous n’avez pas renseigné d’mesures"
          paragraph="Je n’ai aucun problème de mesures"
          button="Ajouter un mesures"
          uniqueId="4"
        />
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default Mesures;
