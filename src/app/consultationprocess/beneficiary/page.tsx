"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  DynamicHtmlTag,
  CustomButton,
  HeadingTag,
  CustomInput,
  CustomLabel,
  CustomImage,
  CustomModal,
  CustomForm,
  CustomDatePicker,
  CustomSelect,
  CustomFullScreenLoader,
} from "@/components";
import { MdClose } from "react-icons/md";
import { CgAdd } from "react-icons/cg";
import {
  addBeneficiaryChildSchema,
  cancelRdv,
  CONSULTAION_PROCESS_ERRORS,
  CONSULTATION_PROCESS_ERROR_MESSAGES_CODE,
  createBeneficiary,
  deleteNearbyPatientApi,
  genderListingApi,
  handleConsultationProcessError,
  handleProcessError,
  ListOption,
  patientNearbyList,
  PatientTeleconsultationsNearbyResponse,
  registerPatientNearby,
} from "@/utility";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import {
  resetConsultationBooking,
  selectConsultationBooking,
  setCompletedStep,
  setRdvId,
  setSelectedPatientId,
} from "@/store/reducers/consultationBookingSlice";
import { useRouter } from "next/navigation";
import { SlClose } from "react-icons/sl";
import { closeModal, openModal } from "@/store/reducers/modalSlice";
import { RootState } from "@/store";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { toast } from "react-toastify";

type Errors = {
  firstName?: string;
  lastName?: string;
  birthdayDate?: string;
  weight?: string;
  height?: string;
  genre?: string;
};

export default function Beneficiary() {
  const dispatch = useDispatch();
  const router = useRouter();
  const consultationBooking = useSelector(selectConsultationBooking);
  const loggedInUser = useSelector(selectLoginResponse);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [nearbyPatients, setNearbyPatients] = useState<PatientTeleconsultationsNearbyResponse["data"]["results"]>([]);
  const [addChildData, setAddChildData] = useState({
    firstName: "",
    lastName: "",
    weight: "",
    height: "",
    genre: "",
    birthdayDate: "",
    patientParentID: loggedInUser?.data?.id,
  });
  const [gender, setGender] = useState<ListOption[]>([]);
  const modalType = useSelector((state: RootState) => state.modal.modalType);
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [selectedPatientIdState, setSelectedPatientIdState] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [existingRdv, setExistingRdv] = useState<number | null>(null);

  const handleDateOptionChange = (date: Date | null) => {
    setErrors(prevErrors => ({ ...prevErrors, birthdayDate: undefined }));

    setAddChildData(prevData => ({
      ...prevData,
      birthdayDate: date ? date.toISOString().split("T")[0] : "",
    }));

    setStartDate(date);
  };

  const fetchNearbyPatients = async () => {
    try {
      dispatch(showLoader("nearby-patient-consultation"));
      const data = await patientNearbyList();
      setNearbyPatients(data.data.results);
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchNearbyPatients();
  }, []);

  useEffect(() => {
    dispatch(setCompletedStep(1));
  }, []);

  const fetchGender = useCallback(async () => {
    try {
      const response = await genderListingApi();
      const genderOptions = response.data.map(gender => ({
        value: gender.code,
        label: gender.name,
      }));
      setGender(genderOptions);
    } catch (error) {
      setGender([]);
    }
  }, []);

  useEffect(() => {
    fetchGender();
  }, [fetchGender]);

  useEffect(() => {
    if (loggedInUser?.data?.id && (consultationBooking.patientId === undefined || consultationBooking.patientId === null)) {
      dispatch(
        setSelectedPatientId({
          patientId: loggedInUser.data.id,
          childrenPatientId: null,
        })
      );
    }
  }, [loggedInUser, consultationBooking.patientId, dispatch]);

  const handleAddChild = async (event: any) => {
    event.preventDefault();

    try {
      await addBeneficiaryChildSchema.validate(addChildData, { abortEarly: false });

      setErrors({});

      const formData = new FormData();

      Object.keys(addChildData).forEach(key => {
        const value = addChildData[key as keyof typeof addChildData];
        formData.append(key, value !== undefined ? String(value) : "");
      });
      formData.append("relationType", "ENFANT");

      dispatch(showLoader("addPatientInfantLoader"));

      await registerPatientNearby(formData);

      setAddChildData({
        firstName: "",
        lastName: "",
        weight: "",
        height: "",
        genre: "",
        birthdayDate: "",
        patientParentID: loggedInUser?.data?.id,
      });
      setStartDate(null);

      closeAddChildModal();

      const data = await patientNearbyList();

      setNearbyPatients(data.data.results);
    } catch (validationError: any) {
      if (validationError.inner) {
        const validationErrors = validationError.inner.reduce(
          (acc: Record<string, string>, err: any) => ({
            ...acc,
            [err.path]: err.message,
          }),
          {}
        );
        setErrors(validationErrors);
      }
      return;
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: undefined,
    }));

    setAddChildData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenderChange = (selectedOption: any) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      genre: undefined,
    }));

    setAddChildData(prevData => ({
      ...prevData,
      genre: selectedOption.value,
    }));
  };

  const handleNextStep = (stepNumber: number, nextPath: string) => {
    dispatch(setCompletedStep(stepNumber));
    router.push(nextPath);
  };

  const handleNextButtonClick = async () => {
    try {
      const payload: any = {
        practitionerId: consultationBooking.practitionerId,
        patientId: consultationBooking.patientId,
        daySlot: consultationBooking.daySlot,
        timeSlot: consultationBooking.timeSlot,
      };

      if (consultationBooking.childrenPatientId) {
        payload.childrenPatientId = consultationBooking.childrenPatientId;
      }

      const response = await createBeneficiary(payload);

      if (response?.data?.codeMessage === "RDV_NOT_AVAILABLE") {
        router.push("/search");
        return;
      }

      const rdvId = response?.data?.id;
      if (rdvId) {
        dispatch(setRdvId(rdvId));
      }

      handleNextStep(1, "/consultationprocess/motifs");
    } catch (error: any) {
      const errorHandlingResult = handleProcessError(error);

      if (errorHandlingResult.action === "openModal") {
        openRdvAlreadyStartedModal();
        setExistingRdv(errorHandlingResult?.rdvId || null);
        return;
      }

      if (errorHandlingResult.action === "redirect") {
        toast.error(errorHandlingResult.message);
        router.push(errorHandlingResult.redirectPath || "/search");
        return;
      }
    }
  };

  const handleCancelRdv = async () => {
    try {
      if (existingRdv) {
        await cancelRdv(existingRdv);
        toast.success("Rendez-vous annulé avec succès");
        closeRdvAlreadyStartedModal();
        router.push("/search");
        return;
      } else {
        console.log("ah daccord");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'annulation du rendez-vous");
    } finally {
      closeRdvAlreadyStartedModal();
    }
  };

  const handleRemovePatient = async (idNearby: string) => {
    try {
      dispatch(showLoader("deletePatientInfantLoader"));
      const payload = {
        patientParentID: loggedInUser?.data?.id,
        idNearby,
      };
      await deleteNearbyPatientApi(payload);
      const data = await patientNearbyList();
      setNearbyPatients(data.data.results);
      closeDeletePatientModal();
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  const openDeletePatientModal = (patientId: string) => {
    setSelectedPatientIdState(patientId);
    dispatch(openModal("deletePatientInfant"));
  };

  const closeDeletePatientModal = () => {
    dispatch(closeModal());
  };

  const openAddChildModal = () => {
    dispatch(openModal("addPatientInfant"));
  };

  const closeAddChildModal = () => {
    setErrors({});
    setAddChildData({
      firstName: "",
      lastName: "",
      weight: "",
      height: "",
      genre: "",
      birthdayDate: "",
      patientParentID: loggedInUser?.data?.id,
    });
    setStartDate(null);
    dispatch(closeModal());
  };

  const closeRdvAlreadyStartedModal = () => {
    dispatch(closeModal());
  };

  const openRdvAlreadyStartedModal = () => {
    dispatch(openModal("rdvAlreadyStarted"));
  };

  if (isLoading) {
    return <CustomFullScreenLoader />;
  }

  return (
    <>
      <DynamicHtmlTag type="div" className="beneficiary-section lg:px-5 flex justify-between flex-col lg:h-full">
        <DynamicHtmlTag type="div">
          <HeadingTag type="h2" className="font-bold text-sm lg:text-lg">
            Qui consulte ?
          </HeadingTag>
          {/* --- Choose fields Start --- */}
          <DynamicHtmlTag
            type="div"
            className="doctor-card-detail consult-radio grid sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 2xl:grid-cols-6 gap-2 lg:gap-2 2xl:gap-6 my-2 lg:my-5">
            {/* "Vous" Option */}
            <DynamicHtmlTag type="div" className="radio-card">
              <CustomInput
                className={`hidden custom-select`}
                type="radio"
                name="selectTime"
                id="time-slot-vous"
                value={loggedInUser?.data?.id || ""}
                onChange={() =>
                  dispatch(
                    setSelectedPatientId({
                      patientId: loggedInUser?.data?.id || 0,
                      childrenPatientId: null,
                    })
                  )
                }
                defaultChecked={true}
                // disabled={consultationBooking.completedSteps >= 2}
              />
              <CustomLabel htmlFor="time-slot-vous" className={`radio-label d-block flex items-center justify-center cursor-pointer`}>
                <DynamicHtmlTag
                  type="span"
                  className="[&&]:py-1 lg:[&&]:py-2 [&&]:rounded-full [&&&]:font-semibold custom-select-btn"
                  title={consultationBooking.completedSteps >= 2 ? "La prise de rendez-vous pour la téléconsultation a déjà commencé" : ""}>
                  Vous
                </DynamicHtmlTag>
              </CustomLabel>
            </DynamicHtmlTag>

            {/* Mapped Patients */}
            {nearbyPatients &&
              nearbyPatients.length > 0 &&
              nearbyPatients.map((patient, index) => (
                <DynamicHtmlTag key={patient.id || index} type="div" className="radio-card">
                  <CustomInput
                    className="hidden custom-select"
                    type="radio"
                    name="selectTime"
                    id={`time-slot-${patient.id}`}
                    value={patient.nearby.id}
                    onChange={() =>
                      dispatch(
                        setSelectedPatientId({
                          patientId: loggedInUser?.data?.id || 0,
                          childrenPatientId: patient.nearby.id, // Pass patient.id directly
                        })
                      )
                    }
                    defaultChecked={false}
                  />
                  <CustomLabel htmlFor={`time-slot-${patient.id}`} className="radio-label d-block flex items-center justify-center cursor-pointer">
                    <DynamicHtmlTag
                      type="span"
                      className="[&&]:py-1 lg:[&&]:py-2 [&&]:rounded-full [&&&]:font-semibold custom-select-btn text-ellipsis overflow-hidden whitespace-nowrap"
                      title={patient.nearby.firstName}>
                      {patient.nearby.firstName} {patient.nearby.lastName}
                      <SlClose
                        className="absolute right-2 top-2 mt-[3px] cursor-pointer"
                        onClick={e => {
                          e.stopPropagation();
                          openDeletePatientModal(patient.id.toString());
                        }}
                      />
                    </DynamicHtmlTag>
                  </CustomLabel>
                </DynamicHtmlTag>
              ))}
            <CustomButton
              as="button"
              onClick={openAddChildModal}
              className="card-btn text-xs text-white font-semibold py-1 lg:py-2 md:mt-0 sm:col-span-2 md:col-span-1 sm:w-4/5 md:w-full rounded-full sm:me-0 md:mx-auto block">
              Ajouter un enfant
            </CustomButton>
          </DynamicHtmlTag>
          {/* --- Choose fields End --- */}
        </DynamicHtmlTag>

        {/* Add Members Custom Modal Starts */}
        <CustomModal
          id="add_user_modal"
          isOpen={modalType === "addPatientInfant"}
          onClose={closeAddChildModal}
          modalClassName="w-full sm:max-w-1/2 md:max-w-xl rounded-xl">
          <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-l from-sky-500 to-indigo-500 p-0 pt-4">
            <DynamicHtmlTag type="div" className="bg-base-100 p-4">
              <HeadingTag type="h3" className="text-blue font-semibold text-sm md:text-base 2xl:text-lg flex items-center gap-2">
                <CgAdd className="w-5 h-5" />
                Ajouter un enfant
                <MdClose
                  onClick={closeAddChildModal}
                  className="ms-auto cursor-pointer text-blue border border-blue rounded-full w-5 h-5 lg:w-6 lg:h-6 p-1 hover:bg-primary hover:border-primary hover:text-white"
                />
              </HeadingTag>
              <CustomForm onSubmit={handleAddChild} className="pt-5 lg:px-4 space-y-3">
                <DynamicHtmlTag type="div" className="form-group flex gap-3 w-full items-start">
                  <DynamicHtmlTag type="p" className="w-4/12 text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                    Nom:
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="w-8/12">
                    <CustomLabel
                      className={`input border ${
                        errors.firstName ? "border-red-500" : "border-gray-400"
                      } p-2 flex items-center gap-2 rounded-lg mb-1`}>
                      <CustomInput
                        type="text"
                        name="firstName"
                        className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 text-xs md:text-xs 2xl:text-sm"
                        placeholder="Nom"
                        value={addChildData.firstName}
                        onChange={handleInputChange}
                      />
                    </CustomLabel>
                    {errors.firstName && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-xs mt-1">
                        {errors.firstName}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="form-group flex gap-3 w-full items-start">
                  <DynamicHtmlTag type="p" className="w-4/12 text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                    Prénom:
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="w-8/12">
                    <CustomLabel
                      className={`input border ${
                        errors.lastName ? "border-red-500" : "border-gray-400"
                      } p-2 flex items-center gap-2 rounded-lg mb-1`}>
                      {" "}
                      <CustomInput
                        type="text"
                        name="lastName"
                        className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 text-xs md:text-xs 2xl:text-sm"
                        placeholder="Prénom"
                        value={addChildData.lastName}
                        onChange={handleInputChange}
                      />
                    </CustomLabel>
                    {errors.lastName && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-xs mt-1">
                        {errors.lastName}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="form-group flex gap-3 w-full items-start">
                  <DynamicHtmlTag type="p" className="w-4/12 text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                    Date de naissance:
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="w-8/12">
                    <DynamicHtmlTag
                      type="div"
                      className={`border p-2 flex items-center gap-2 rounded-lg mb-1 ${errors.birthdayDate ? "border-red-500" : "border-gray-400"}`}>
                      <DynamicHtmlTag type="div" className="form-date-picker date-picker text-xs md:text-xs 2xl:text-sm">
                        <CustomDatePicker
                          selected={startDate}
                          maxDate={new Date()}
                          onChange={(date: Date | null) => {
                            handleDateOptionChange(date);
                            if (date) {
                              setErrors((prevErrors: any) => ({ ...prevErrors, birthdayDate: undefined }));
                            }
                          }}
                          dateFormat={"dd/MM/yyyy"}
                          placeholderText="jj/mm/aaaa"
                          className="outline-none text-2xs lg:text-3xs xl:text-2xs 2xl:text-xs rounded-md w-full"
                        />
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    {errors.birthdayDate && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-xs mt-1">
                        {errors.birthdayDate}
                      </DynamicHtmlTag>
                    )}{" "}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="form-group flex gap-3 w-full items-start">
                  <DynamicHtmlTag type="p" className="w-4/12 text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                    Poids:
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="w-8/12">
                    <CustomLabel
                      className={`input border ${errors.weight ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                      {" "}
                      <CustomInput
                        type="text"
                        name="weight"
                        className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 text-xs md:text-xs 2xl:text-sm"
                        placeholder="Poids"
                        value={addChildData.weight}
                        onChange={handleInputChange}
                      />
                    </CustomLabel>
                    {errors.weight && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-xs mt-1">
                        {errors.weight}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="form-group flex gap-3 w-full items-start">
                  <DynamicHtmlTag type="p" className="w-4/12 text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                    Taille:
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="w-8/12">
                    <CustomLabel
                      className={`input border ${errors.height ? "border-red-500" : "border-gray-400"} p-2 flex items-center gap-2 rounded-lg mb-1`}>
                      {" "}
                      <CustomInput
                        type="text"
                        name="height"
                        className="grow input outline-none focus:outline-none border-none border-[0px] h-auto pl-1 pr-0 text-xs md:text-xs 2xl:text-sm"
                        placeholder="Taille"
                        value={addChildData.height}
                        onChange={handleInputChange}
                      />
                    </CustomLabel>
                    {errors.height && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-xs mt-1">
                        {errors.height}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="form-group flex gap-3 w-full items-start">
                  <DynamicHtmlTag type="p" className="w-4/12 text-xs md:text-xs 2xl:text-sm font-semibold text-blue pb-1">
                    Genre:
                    <DynamicHtmlTag type="span" className="text-red-500">
                      *
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="w-8/12">
                    <CustomSelect
                      name="genre"
                      className="w-full text-xs md:text-xs 2xl:text-sm countries-select ville-select border border-gray-400 placeholder-black rounded-lg"
                      placeholder="Genre"
                      value={gender.find(option => option.value === addChildData.genre) || null}
                      options={gender}
                      onChange={(selectedOption: any) => {
                        handleGenderChange(selectedOption);
                        if (selectedOption) {
                          setErrors((prevErrors: any) => ({ ...prevErrors, genre: null }));
                        }
                      }}
                      isClearable
                      menuPlacement="top"
                    />
                    {errors.genre && (
                      <DynamicHtmlTag type="div" className="text-red-500 text-xs mt-1">
                        {errors.genre}
                      </DynamicHtmlTag>
                    )}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex justify-between pt-6">
                  <CustomButton type="button" className="btn btn-danger text-xs 2xl:text-sm rounded-full py-2 px-3 " onClick={closeAddChildModal}>
                    ANNULER
                  </CustomButton>
                  <CustomButton type="submit" className="btn btn-primary text-xs 2xl:text-sm card-btn rounded-full py-2 px-3">
                    AJOUTER
                  </CustomButton>
                </DynamicHtmlTag>
              </CustomForm>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </CustomModal>
        {/* Add Members Custom Modal Ends */}

        {/* --- Choose field bottom Start --- */}
        <DynamicHtmlTag type="div" className="lg:mb-3">
          <DynamicHtmlTag type="div" className="flex sm:flex-col sm:gap-4 md:gap-0 md:flex-row justify-between items-end ">
            <CustomImage src="/images/consult-image.svg/" alt="beneficiary" width={400} height={400} className="beneficiary-image" />
            <DynamicHtmlTag type="div" className="sticky bottom-0 z-10 bg-base-100 w-full text-end">
              <CustomButton
                as="button"
                className={`card-btn text-xs text-white py-2 px-10 lg:px-9 2xl:px-10 font-semibold rounded-full inline-block`}
                onClick={handleNextButtonClick}
                title="La prise de rendez-vous pour la téléconsultation a déjà commencé">
                Suivant
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
        {/* --- Choose field bottom End ---- */}

        {/* Delete Patient Child Modal Box Starts */}
        {modalType === "deletePatientInfant" && (
          <CustomModal
            id="delete_child_modal"
            isOpen={modalType === "deletePatientInfant"}
            onClose={closeDeletePatientModal}
            modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
            <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
              <DynamicHtmlTag type="div" className="bg-base-100 py-3 lg:py-6 px-4 lg:px-8">
                <HeadingTag type="h4" className="text-blue font-bold text-sm lg:text-lg xl:text-xl flex items-center justify-between gap-2 pl-2">
                  Supression d{"'"}un enfant
                  <CustomButton type="button" className="w-fit inline-block custom-grey-btn p-0.5 rounded-full">
                    <MdClose
                      onClick={closeDeletePatientModal}
                      className="ms-auto cursor-pointer text-blue border border-blue rounded-full w-5 h-5 lg:w-6 lg:h-6 p-1 hover:bg-primary hover:border-primary hover:text-white"
                    />{" "}
                  </CustomButton>
                </HeadingTag>
                <DynamicHtmlTag
                  type="div"
                  className="text-blue py-8 px-2 w-11/12 lg:w-8/12 xl:w-10/12 text-center font-semibold text-sm lg:text-lg mx-auto">
                  Êtes-vous sur de vouloir supprimer votre enfant:{" "}
                  <DynamicHtmlTag type="span" className="capitalize">
                    {nearbyPatients.find(patient => patient.id.toString() === selectedPatientIdState)?.nearby.firstName || "inconnu"}
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-2/3 flex items-center justify-center gap-3 mx-auto mt-4 lg:mt-6">
                  <CustomButton
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (selectedPatientIdState) {
                        handleRemovePatient(selectedPatientIdState);
                      }
                    }}
                    type="button"
                    className="card-btn text-sm py-1 px-4 rounded-full bg-gray-100 w-1/3 text-white capitalize">
                    SUPPRIMER
                  </CustomButton>
                  <CustomButton
                    onClick={closeDeletePatientModal}
                    type="button"
                    className="btn btn-danger text-sm py-1 px-4 rounded-full bg-gray-100 w-1/3 text-white capitalize">
                    ANNULER
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </CustomModal>
        )}
        {/* Delete Patient Child Modal Box Ends */}

        {/* RDV already started Modal Box Starts */}
        {modalType === "rdvAlreadyStarted" && (
          <CustomModal
            id="rdvAlreadyStarted"
            isOpen={modalType === "rdvAlreadyStarted"}
            onClose={closeRdvAlreadyStartedModal}
            modalClassName="w-11/12 sm:max-w-xl md:max-w-xl rounded-xl">
            <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4">
              <DynamicHtmlTag type="div" className="bg-base-100 py-3 lg:py-6 px-4 lg:px-8">
                <DynamicHtmlTag
                  type="div"
                  className="text-blue py-8 px-2 w-11/12 lg:w-8/12 xl:w-10/12 text-center font-semibold text-sm lg:text-lg mx-auto">
                  <DynamicHtmlTag type="p" className="text-center">
                    Vous avez déjà un rendez-vous de prévu
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="text-center">
                    pour le {consultationBooking.daySlot} à {consultationBooking.timeSlot}
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="mt-4">
                    Souhaiter-vous annuler votre rendez-vous ?
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="w-2/3 flex items-center justify-center gap-3 mx-auto mt-4 lg:mt-6">
                  <CustomButton
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (existingRdv) {
                        handleCancelRdv();
                      }
                    }}
                    type="button"
                    className="card-btn text-sm py-1 px-4 rounded-full bg-gray-100 w-1/3 text-white capitalize">
                    Oui
                  </CustomButton>
                  <CustomButton
                    onClick={closeRdvAlreadyStartedModal}
                    type="button"
                    className="card-btn  text-sm py-1 px-4 rounded-full bg-gray-100 w-1/3 text-white capitalize">
                    Non
                  </CustomButton>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </CustomModal>
        )}
      </DynamicHtmlTag>
    </>
  );
}
