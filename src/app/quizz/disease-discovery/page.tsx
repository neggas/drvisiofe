"use client";
import { CustomAsyncSelect, CustomButton, CustomImage, CustomInput, CustomLink, DynamicHtmlTag, HeadingTag } from "@/components";
import { hideLoader, showLoader } from "@/store/reducers/loaderSlice";
import { selectLoginResponse } from "@/store/reducers/loginSlice";
import {
  API_URL,
  DiscoveryMedicalSpecialityTypes,
  fetchCourseBySpecialityApi,
  fetchDiscoveryMedicalSpecialityApi,
  getLocalStorageData,
  quizzCourseSpecialitySchema,
  quizzCourseValiditySchema,
  searchSpecialitiesApi,
} from "@/utility";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const DiseaseDiscovery = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const guestUserData = getLocalStorageData("guest_user_data", {});
  const [isDiscoverClicked, setIsDiscoverClicked] = useState(false);
  const [specialities, setSpecialities] = useState<DiscoveryMedicalSpecialityTypes[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [fetchedSpeciality, setFetchedSpeciality] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [coursesLoaded, setCoursesLoaded] = useState(false);
  const [errors, setErrors] = useState<{ selectedSpeciality?: string }>({});
  const [courseErrors, setCourseErrors] = useState<{ selectedCourse?: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const isTeleconsultationBooked = getLocalStorageData("isTeleconsultationBooked", true);

  const backToCourse = () => {
    setSelectedSpeciality(null);
    setSelectedCourse(null);
    setCourses([]);
    setCoursesLoaded(false);
    setIsDiscoverClicked(false);
    router.replace("/quizz/disease-discovery");
  };

  const loggedInUser = useSelector(selectLoginResponse);

  const fetchCoursesBySpeciality = async (specialityId: number) => {
    const payload = {
      firstName: guestUserData.firstName || "Ludo",
      lastName: guestUserData.lastName || "Brule",
      ipAddress: guestUserData.ipAddress || "",
      macAddress: guestUserData.macAddress || "",
      idSpeciality: specialityId,
    };

    try {
      const response = await fetchCourseBySpecialityApi(payload);
      const data = response.data.results || [];
      setCourses(data);
      setCoursesLoaded(true);

      // Store the speciality details from the course response
      if (data.length > 0) {
        setFetchedSpeciality(data[0].speciality);
      }
    } catch (error) {}
  };

  const handleSelectCourse = (speciality: any) => {
    setSelectedSpeciality(speciality);
    setErrors({});
    setIsDiscoverClicked(false);
  };

  const handleDiscoverClick = async () => {
    try {
      setErrors({});
      setCourseErrors({});

      // Validate speciality selection
      await quizzCourseSpecialitySchema.validate({ selectedSpeciality: selectedSpeciality?.id }, { abortEarly: false });

      // Validate course selection only if it is necessary in the current state
      if (isDiscoverClicked) {
        await quizzCourseValiditySchema.validate({ selectedCourse: selectedCourse?.id }, { abortEarly: false });
      }

      if (selectedSpeciality && !coursesLoaded) {
        fetchCoursesBySpeciality(selectedSpeciality.id);
        setIsDiscoverClicked(true);
      } else if (selectedCourse) {
        router.push(`/quizz/disease-discovery/${selectedCourse.id}`);
      }
    } catch (err: any) {
      if (err.inner) {
        const validationErrors = err.inner.reduce((acc: any, { path, message }: any) => {
          if (path === "selectedSpeciality") {
            return { ...acc, [path]: message };
          } else if (path === "selectedCourse") {
            return { ...courseErrors, [path]: message };
          }
          return acc;
        }, {});

        // Separate errors for speciality and course
        setErrors(validationErrors);
        setCourseErrors(validationErrors);
      }
    }
  };

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setCourseErrors({});
  };

  const fetchSpecialityData = async () => {
    dispatch(showLoader("medical-discovery-navigation"));

    const payload = {
      firstName: guestUserData.firstName || "Ludo",
      lastName: guestUserData.lastName || "Brule",
      ipAddress: guestUserData.ipAddress || "",
      macAddress: guestUserData.macAddress || "",
    };

    try {
      const response = await fetchDiscoveryMedicalSpecialityApi(payload);
      const data = response.data.patientCourseStatisticBySpecialityList || [];
      setSpecialities(data);

      // After fetching specialities, check if specialityId is in URL
      const specialityIdParam = searchParams.get("specialityId");
      if (specialityIdParam) {
        const specialityId = parseInt(specialityIdParam, 10);
        const specialityItem = data.find((item: any) => item.speciality.id === specialityId);
        if (specialityItem) {
          setSelectedSpeciality(specialityItem.speciality);
          await fetchCoursesBySpeciality(specialityId);
          setIsDiscoverClicked(true);
        }
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleSearchChange = async (e: any) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 3) {
      try {
        const response = await searchSpecialitiesApi(0, 10, query);
        const searchResults = response.data.results || [];
        setSpecialities(searchResults);
      } catch (error) {}
    } else if (query.length === 0) {
      fetchSpecialityData();
    }
  };

  useEffect(() => {
    fetchSpecialityData();
  }, [searchParams]);

  const loadSpecialityOptions = async (inputValue: string, callback: (options: any[]) => void) => {
    if (inputValue.length >= 3) {
      try {
        const response = await searchSpecialitiesApi(0, 10, inputValue);
        const searchResults = response.data.results || [];
        const options = searchResults.map((item: any) => ({
          label: item.speciality.name,
          value: item.speciality.id,
        }));
        callback(options);
      } catch (error) {
        callback([]);
      }
    } else {
      callback([]);
    }
  };

  const handleSpecialityChange = async (selectedOption: any) => {
    if (selectedOption) {
      const selectedSpecialityItem = specialities.find(item => item.speciality.id === selectedOption.value);
      if (selectedSpecialityItem) {
        setSelectedSpeciality(selectedSpecialityItem.speciality);
        setErrors({});
        setCourseErrors({});

        // Automatically set and proceed with the discovery process
        try {
          // Validate and navigate
          await quizzCourseSpecialitySchema.validate({ selectedSpeciality: selectedSpecialityItem.speciality.id }, { abortEarly: false });

          // Fetch courses by speciality if not already loaded
          if (!coursesLoaded) {
            await fetchCoursesBySpeciality(selectedSpecialityItem.speciality.id);
            setIsDiscoverClicked(true);
          }

          // Simulate button click to navigate if courses are loaded
          if (selectedSpecialityItem.speciality) {
            handleDiscoverClick();
          }
        } catch (err) {}
      }
    } else {
      // Clear the selected speciality if input is cleared
      setSelectedSpeciality(null);
      setCourses([]);
      setCoursesLoaded(false);
      setErrors({});
      setCourseErrors({});
    }
  };

  const matchedSpeciality = specialities.find(item => item.speciality.id === (fetchedSpeciality?.id || selectedSpeciality?.id));

  return (
    <DynamicHtmlTag type="div" className="h-full">
      <DynamicHtmlTag type="div" className="hidden lg:flex items-center gap-4 ps-12 pb-2">
        <CustomImage src="/images/maladies-icon.svg" alt="maladies-icon" width={20} height={20} />
        <HeadingTag type="h2" className="text-black font-semibold text-sm uppercase">
          DÉCOUVERTE DES MALADIES
        </HeadingTag>
      </DynamicHtmlTag>
      <DynamicHtmlTag type="div" className="gradient-main pt-4 rounded-xl bg-gradient-to-l from-indigo-500 to-sky-500 h-full">
        <DynamicHtmlTag
          type="div"
          className="bg-white flex flex-col px-2 lg:px-6 rounded-b-xl quiz-inner-dashboard h-auto min-h-full justify-between">
          <HeadingTag type="h2" className="text-xs text-blue uppercase text-center pt-1 pb-0.5 font-semibold lg:hidden">
            découverte des maladies
          </HeadingTag>
          <DynamicHtmlTag type="div" className="py-2 lg:py-4 px-0 lg:px-4 block mx-auto h-1/6 w-full md:w-8/12 lg:w-5/12">
            <DynamicHtmlTag type="div" className="bg-gray-100 rounded-full px-4 py-2 flex items-center justify-start">
              <IoSearchOutline className="text-gray-500 text-lg 2xl:text-xl" />
              {/* <CustomInput
                type="text"
                placeholder="Rechercher un cours ici..."
                name="search"
                className="text-xs bg-transparent w-full outline-none px-2"
                value={searchQuery}
                onChange={handleSearchChange}
              /> */}
              <CustomAsyncSelect
                className="text-xs w-full quiz-searchbox"
                placeholder="Rechercher un cours ici..."
                loadOptions={loadSpecialityOptions}
                onChange={handleSpecialityChange}
                value={selectedSpeciality ? { label: selectedSpeciality.name, value: selectedSpeciality.id } : null}
                isClearable
                noOptionsMessage={({ inputValue }) => (!inputValue ? "Saisissez au moins 3 caractères" : "Aucune option trouvée")}
              />
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag
            type="div"
            className={`shadow-lg rounded-lg h-full md:h-2/3 overflow-hidden ${isTeleconsultationBooked ? "quiz-small-height" : ""}`}>
            <DynamicHtmlTag
              type="div"
              className={`items-center gap-3 px-3 lg:px-6 pt-3 ${selectedSpeciality && isDiscoverClicked ? "flex" : "hidden"}`}>
              <CustomButton
                type="button"
                onClick={backToCourse}
                className="custom-grey-btn w-5 lg:w-8 h-5 lg:h-8 flex items-center justify-center [&&]:shadow-none rounded-full">
                <CustomImage src="/images/back-icon.svg" alt="back-icon" width={8} height={8} className="w-1.5 lg:w-3 h-1.5 lg:h-3" />
              </CustomButton>
              <DynamicHtmlTag type="span" className="text-2xs md:text-xs lg:text-sm font-semibold">
                Retour aux spécialités
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag
              type="div"
              className={`overflow-auto quiz-disease-height md:h-[84%] 2xl:h-[89%] ${selectedSpeciality && isDiscoverClicked ? "h-[90%]" : ""}`}>
              <HeadingTag type="h3" className={`text-xs font-semibold text-center ${selectedSpeciality && isDiscoverClicked ? "hidden" : "pt-2"}`}>
                CHOISIR UNE SPÉCIALITÉ
              </HeadingTag>
              <HeadingTag type="h3" className={`text-xs font-semibold text-center ${selectedSpeciality && isDiscoverClicked ? "pt-2" : "hidden"}`}>
                {selectedSpeciality?.name.toUpperCase()}
              </HeadingTag>

              {/* Specialities List */}
              <DynamicHtmlTag
                type="div"
                className={`courses-row ${
                  selectedSpeciality && isDiscoverClicked ? "hidden" : "flex"
                } grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4 py-2 px-2 lg:px-4 2xl:px-5 mx-auto`}>
                {specialities.map((item, index) => {
                  const isSelected = selectedSpeciality?.id === item.speciality.id;

                  return (
                    <DynamicHtmlTag key={index} type="div" className="flex h-full">
                      <CustomButton
                        onClick={() => handleSelectCourse(item.speciality)}
                        type="button"
                        className={`w-full course-quizs py-3 2xl:py-5 px-1 2xl:px-2 rounded-lg text-center relative shadow-lg flex flex-col justify-between h-full`}
                        style={{
                          backgroundColor:
                            selectedSpeciality?.id === item.speciality.id
                              ? item.speciality.color
                              : selectedSpeciality
                                ? "#d3d3d3"
                                : item.speciality.color,
                          color: "#fff",
                          outline: isSelected ? `2px solid ${item.speciality.color}` : "none",
                          outlineOffset: isSelected ? "4px" : "0px",
                        }}>
                        <CustomImage
                          src={`${API_URL}${item.speciality.file?.url}`}
                          alt={item.speciality.name}
                          width={62}
                          height={77}
                          className="w-8 md:w-10 2xl:w-12 h-8 md:h-10 2xl:h-12 m-auto"
                        />
                        <DynamicHtmlTag
                          type="div"
                          className="font-semibold text-2xs md:text-xs lg:text-sm xl:text-2xs 2xl:text-base mx-auto line-clamp-1">
                          {item.speciality.name}
                        </DynamicHtmlTag>
                        <DynamicHtmlTag
                          type="span"
                          className="absolute top-1 right-1 md:right-2 text-2xs md:text-xs lg:text-sm font-semibold text-white">
                          {item.nbReadCourse}/{item.nbTotalCourse}
                        </DynamicHtmlTag>
                      </CustomButton>
                    </DynamicHtmlTag>
                  );
                })}
              </DynamicHtmlTag>

              {/* After Select Course Start */}
              <DynamicHtmlTag
                type="div"
                className={`courses-row ${
                  selectedSpeciality && isDiscoverClicked ? "flex" : "hidden"
                } items-center flex-col justify-center py-2 px-2 lg:px-4 2xl:px-5 mx-auto flex-wrap`}>
                <DynamicHtmlTag type="div" className="w-full">
                  <DynamicHtmlTag type="div" className="w-2/3 md:w-1/3 xl:w-1/4 p-0 md:p-2 m-auto">
                    <CustomButton
                      type="button"
                      className="relative rounded-lg px-1 py-2 2xl:py-3 text-center cursor-pointer w-full"
                      style={{ backgroundColor: fetchedSpeciality?.color || selectedSpeciality?.color }}>
                      <CustomImage
                        src={
                          fetchedSpeciality?.file?.url
                            ? `${API_URL}${fetchedSpeciality.file.url}`
                            : selectedSpeciality?.file?.url
                              ? `${API_URL}${selectedSpeciality.file.url}`
                              : "/images/placeholder.png"
                        }
                        alt={fetchedSpeciality?.name || selectedSpeciality?.name}
                        width={62}
                        height={77}
                        className="w-8 md:w-10 2xl:w-12 h-8 md:h-10 2xl:h-12 m-auto"
                      />
                      <HeadingTag
                        type="h5"
                        className="ps-3 sm:ps-0 text-2xs md:text-xs 2xl:text-sm font-semibold line-clamp-2 items-center text-center pt-1 text-white">
                        {fetchedSpeciality?.name || selectedSpeciality?.name}{" "}
                      </HeadingTag>
                      <DynamicHtmlTag type="span" className="absolute top-2 right-2 text-2xs md:text-xs 2xl:text-sm font-normal text-white">
                        {matchedSpeciality?.nbReadCourse}/{matchedSpeciality?.nbTotalCourse}
                      </DynamicHtmlTag>
                    </CustomButton>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <HeadingTag type="h3" className="text-xs mt-3 2xl:mt-5 font-semibold">
                  CHOISIR UN COURS
                </HeadingTag>

                <DynamicHtmlTag
                  type="div"
                  className={`courses-row ${selectedSpeciality && isDiscoverClicked ? "grid grid-cols-2 lg:grid-cols-3 gap-2" : "hidden"} p-2 mx-auto w-full xl:w-9/12 2xl:w-4/5`}>
                  {courses.map((course, index) => {
                    const isSelected = selectedCourse?.id === course.id;
                    const courseColor = course?.speciality?.color || "#808080";

                    return (
                      <DynamicHtmlTag key={index} type="div" className="w-full p-0 lg:p-[0.169rem] 2xl:p-3.5 h-full flex">
                        <CustomButton
                          onClick={() => handleCourseClick(course)}
                          className="relative flex rounded-lg items-center justify-center px-1 md:px-3 py-4 md:py-6 2xl:py-9 cursor-pointer w-full text-white"
                          style={{
                            backgroundColor: isSelected || !selectedCourse ? courseColor : "#d3d3d3",
                            outline: isSelected ? `2px solid ${courseColor}` : "none",
                            outlineOffset: isSelected ? "4px" : "0px",
                          }}>
                          {/* Conditionally render the "courses done" image */}
                          {course.isRead && (
                            <CustomImage
                              alt="courses done"
                              src="/images/read.svg"
                              width={30}
                              height={30}
                              className="absolute -top-1 -right-1 w-5 lg:w-7 h-5 lg:h-7"
                            />
                          )}

                          <HeadingTag type="h5" className="text-2xs md:text-xs 2xl:text-sm font-semibold">
                            {course.courseName}
                          </HeadingTag>
                        </CustomButton>
                      </DynamicHtmlTag>
                    );
                  })}
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="flex justify-between items-end py-3 md:py-5 px-0 h-1/6">
            <DynamicHtmlTag
              type="div"
              className={`flex items-center gap-2 w-full md:w-4/12 ${selectedSpeciality && isDiscoverClicked ? "" : "hidden"}`}>
              <CustomImage alt="courses done" src="/images/read.svg" width={30} height={30} className="" />
              <DynamicHtmlTag type="span" className="text-xs">
                *Cours déjà lu
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <DynamicHtmlTag type="div" className="block w-full">
              <CustomButton
                type="button"
                onClick={handleDiscoverClick}
                className={`cstm-btn text-xs [&&]:rounded-xl py-2 px-5 float-end ${
                  selectedSpeciality && (selectedCourse || !isDiscoverClicked) ? "" : "cursor-not-allowed opacity-50"
                }`}
                disabled={!selectedSpeciality || (isDiscoverClicked && !selectedCourse)}
                title={
                  !selectedSpeciality
                    ? "Veuillez sélectionner une spécialité"
                    : isDiscoverClicked && !selectedCourse
                      ? "Veuillez sélectionner un cours"
                      : ""
                }>
                Découvrir
              </CustomButton>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </DynamicHtmlTag>
  );
};

export default DiseaseDiscovery;
