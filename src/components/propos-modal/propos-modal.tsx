"use client";
import React, { useState } from "react";
import {
  CustomButton,
  CustomImage,
  CustomLabel,
  CustomLink,
  CustomModal,
  DynamicHtmlTag,
  HeadingTag,
  Introductiontab,
  MarchéTab,
  ProduitTab,
} from "@/components";
import { IoCloseSharp } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";

interface ProposModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProposModal: React.FC<ProposModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentScreen, setCurrentScreen] = useState(1); // State to track the current screen

  // Handler to move to the next screen
  const handleNext = () => {
    if (currentScreen < 7) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  // Handler to move to the previous screen
  const handlePrev = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };
  return (
    <CustomModal id="propos_modal" isOpen={isOpen} onClose={onClose} modalClassName="w-full h-full rounded-xl ">
      <DynamicHtmlTag type="div" className="modal-box bg-gradient-to-r from-sky-500 to-indigo-500 p-0 pt-4 h-full relative overflow-hidden">
        <DynamicHtmlTag type="div" className="bg-base-100 propos-bg h-full">
          {/* background Ellipses Start  */}
          <DynamicHtmlTag type="div" className="left-top ellipse mt-16 lg:mt-0">
            <CustomImage src="/images/left-top-ellipse.svg" width={350} height={250} alt="left-top-ellipse" className="hidden lg:block" />
            <CustomImage src="/images/left-top-ellipse-mobile.png" width={150} height={150} alt="left-top-ellipse" className="lg:hidden float-end" />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="right-top ellipse w-2/6 lg:w-auto">
            <CustomImage src="/images/right-top-ellipse.svg" width={200} height={200} alt="right-top-ellipse" className="hidden lg:block" />
            <CustomImage src="/images/right-top-ellipse-mobile.png" width={50} height={50} alt="right-top-ellipse" className="lg:hidden float-end" />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="left-bottom ellipse">
            <CustomImage src="/images/left-bottom-ellipse.svg" width={200} height={180} alt="left-bottom-ellipse" className="hidden lg:block" />
            <CustomImage
              src="/images/left-bottom-ellipse-mobile.png"
              width={100}
              height={100}
              alt="left-bottom-ellipse"
              className="lg:hidden float-start"
            />
          </DynamicHtmlTag>
          <DynamicHtmlTag type="div" className="right-bottom ellipse">
            <CustomImage src="/images/right-bottom-ellipse.svg" width={205} height={180} alt="right-bottom-ellipse" className="hidden lg:block" />
            <CustomImage
              src="/images/right-bottom-ellipse-mobile.png"
              width={100}
              height={100}
              alt="right-bottom-ellipse"
              className="lg:hidden float-start"
            />
          </DynamicHtmlTag>
          {/* background Ellipses End  */}
        </DynamicHtmlTag>
        <DynamicHtmlTag type="div" className="modal-content relative w-full px-0 py-2 flex flex-col justify-between h-[98%] overflow-hidden pb-0">
          {/* Header Start  */}
          <DynamicHtmlTag type="div" className="flex items-center justify-center lg:justify-between w-full px-4">
            <CustomImage src="/images/logos/logoBlue.png" width={150} height={150} alt="logo" className="hidden lg:block" />
            <DynamicHtmlTag type="div" className="flex gap-2 lg:gap-9 custom-border-bottom">
              <DynamicHtmlTag
                type="h4"
                onClick={() => setCurrentScreen(1)}
                className={`cursor-pointer propos text-xs lg:text-sm font-semibold text-black px-2 relative ${[1, 2].includes(currentScreen) ? "active-tab" : "non-active-tab"}`}>
                Introduction
              </DynamicHtmlTag>
              <DynamicHtmlTag
                type="h4"
                onClick={() => setCurrentScreen(3)}
                className={`cursor-pointer propos text-xs lg:text-sm font-semibold text-black px-2 relative ${[3, 4, 5].includes(currentScreen) ? "active-tab" : "non-active-tab"}`}>
                Produit
              </DynamicHtmlTag>
              <DynamicHtmlTag
                type="h4"
                onClick={() => setCurrentScreen(6)}
                className={`cursor-pointer propos text-xs lg:text-sm font-semibold text-black px-2 relative ${[6, 7].includes(currentScreen) ? "active-tab" : "non-active-tab"}`}>
                Marché
              </DynamicHtmlTag>
            </DynamicHtmlTag>
            <HeadingTag
              type="h3"
              className="text-blue font-bold text-sm lg:text-lg flex items-center justify-between gap-2 absolute lg:relative right-2">
              <CustomButton className="w-fit inline-block custom-grey-btn p-0.5 rounded-full" as="button" onClick={onClose}>
                <IoCloseSharp className="w-3 lg:w-5 h-3 lg:h-5" />
              </CustomButton>
            </HeadingTag>
          </DynamicHtmlTag>
          {/* Tab Content Start  */}
          <DynamicHtmlTag type="div" className="w-full h-full md:h-[88%] flex flex-col justify-between p-5 overflow-y-scroll md:overflow-hidden">
            {/* Render screen content conditionally based on currentScreen */}
            {currentScreen === 1 && (
              <DynamicHtmlTag type="div" className="h-auto screen-1 md:h-[80%]">
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <CustomImage
                    src="/images/logos/logoBlue.png"
                    width={100}
                    height={100}
                    alt="logo"
                    className="w-full md:w-[100px] md:mt-12 lg:hidden"
                  />
                  <HeadingTag type="h4" className="text-center w-full  font-bold text-2xl lg:ms-5 lg:mt-0 md:w-32 md:text-left">
                    Introduction et aperçu de l{"'"}entreprise
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="w-6/12 text-md mx-auto text-center font-semibold -mt-12 hidden lg:block">
                    Notre entreprise incarne l{"'"}épicentre de l{"'"}innovation contemporaine où la santé, la technologie de pointe et l{"'"}
                    ingéniosité entrepreneuriale se fondent pour redéfinir l{"'"}expérience des soins à distance.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className="flex items-end lg:items-center w-full lg:w-10/12 mx-auto -mt-12 lg:mt-8 gap-x-20 flex-col-reverse lg:flex-row text-justify overflow-y-scroll lg:overflow-hidden h-auto md:h-[80%] lg:h-auto">
                  <DynamicHtmlTag type="p" className="font-semibold text-[14px] lg:text-sm lg:w-8/12">
                    Forts d{"'"}une vision audacieuse, nous avons conçu une solution de téléconsultation qui transcende les barrières physiques,
                    offrant aux patients la liberté de consulter une diversité de spécialistes médicaux sans quitter le confort de leur foyer. Notre
                    fondement repose sur une synergie unique : l{"'"}alliance d{"'"}une expertise médicale pointue, garantie par la finesse d{"'"}un
                    médecin spécialiste, l{"'"}approche holistique d{"'"}un médecin généraliste dévoué au parcours de soin patient-centré, complétée
                    par la prouesse technologique d{"'"}un architecte technique, dont l{"'"}excellence est certifiée par l{"'"}éminente école des
                    mines.
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="w-full text-[12px] md:text-2xs mx-auto text-center font-semibold my-4 lg:hidden">
                    Notre entreprise incarne l{"'"}épicentre de l{"'"}innovation contemporaine où la santé, la technologie de pointe et l{"'"}
                    ingéniosité entrepreneuriale se fondent pour redéfinir l{"'"}expérience des soins à distance.
                  </DynamicHtmlTag>
                  <CustomImage src="/images/introfirst.png" alt="introfirst.png" width={450} height={200} className="w-full mt-24 mb-5 lg:w-4/12" />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}

            {currentScreen === 2 && (
              <DynamicHtmlTag type="div" className="screen-2 h-[80%]">
                <DynamicHtmlTag type="div" className="flex items-center justify-between w-full lg:w-11/12 h-full me-auto flex-col lg:flex-row">
                  <DynamicHtmlTag
                    type="div"
                    className="flex items-center flex-row lg:flex-col justify-between w-full lg:w-4/12 lg:gap-8 mt-5 lg:mt-0">
                    <CustomImage src="/images/intro-welcome.webp" alt="intro-welcome" width={150} height={150} className="w-6/12 lg:w-8/12 me-1" />
                    <CustomImage
                      src="/images/intro-welcome-without-hover.webp"
                      alt="intro-welcome-without-hover"
                      width={150}
                      height={150}
                      className="ms-1 w-6/12 lg:w-8/12"
                    />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="div" className="w-full lg:w-8/12 text-2xs lg:text-base font-semibold leading-relaxed lg:pe-16 text-justify">
                    <DynamicHtmlTag type="p" className="my-2 lg:my-4">
                      La plateforme que notre entreprise propose est le résultat d{"'"}une quête incessante d{"'"}excellence et d{"'"}accessibilité
                      dans les soins de santé. Pensée pour être à la fois intuitive et avancée, elle se veut l{"'"}incarnation de la simplicité
                      couplée à l{"'"}
                      efficacité.
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="p" className="my-2 lg:my-8">
                      Conscients des enjeux actuels du secteur médical, nous avons développé une interface qui répond avec précision aux besoins des
                      patients et des professionnels de santé, alliant ergonomie et technologie de pointe. Cette plateforme ne se limite pas à être un
                      outil de téléconsultation; elle se présente comme un espace de convergence où la qualité des soins est rehaussée par une
                      expérience utilisateur sans égale.
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="p" className="my-2 lg:my-4">
                      Notre équipe pluridisciplinaire, nourrie par l{"'"}innovation et l{"'"}expertise, a pour ambition de rendre les soins de santé
                      plus inclusifs et de faire de cet accès élargi une réalité quotidienne pour tous. En bousculant les paradigmes, notre entreprise
                      n{"'"}est pas seulement à l{"'"}avant-garde de la santé digitale; elle en redéfinit les contours pour un futur où la médecine de
                      précision et l{"'"}accompagnement personnalisé deviennent la norme, accessibles à chacun, partout et à tout moment.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}
            {currentScreen === 3 && (
              <DynamicHtmlTag type="div" className="screen-3 h-[80%]">
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <CustomImage src="/images/logos/logoBlue.png" width={100} height={100} alt="logo" className="mt-12 lg:hidden" />
                  <HeadingTag type="h4" className="w-32 font-bold text-sm lg:text-lg lg:ms-5 lg:mt-0">
                    Notre produit, notre service
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="w-6/12 text-md mx-auto text-center font-semibold hidden lg:block -mt-12">
                    DrVisio redéfinit l{"'"}excellence en matière de solutions de téléconsultation grâce à un ensemble de fonctionnalités
                    sophistiquées conçues spécifiquement pour les professionnels de la santé et leurs patients.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className="flex items-end lg:items-center w-full lg:w-10/12 mx-auto lg:mt-8 gap-x-20 flex-col-reverse lg:flex-row">
                  <DynamicHtmlTag type="p" className="font-semibold text-xs lg:text-sm lg:w-8/12">
                    Notre application est l{"’"}intersection parfaite entre convivialité et innovation technologique, permettant une prise en charge
                    médicale à distance de première qualité.
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="w-full text-xs mx-auto text-center font-semibold my-6 lg:hidden">
                    DrVisio redéfinit l{"'"}excellence en matière de solutions de téléconsultation grâce à un ensemble de fonctionnalités
                    sophistiquées conçues spécifiquement pour les professionnels de la santé et leurs patients.
                  </DynamicHtmlTag>
                  <CustomImage src="/images/produit-image.webp" alt="produitimage" width={450} height={200} className="w-7/12 lg:w-4/12" />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}
            {currentScreen === 4 && (
              <DynamicHtmlTag type="div" className="screen-2 lg:h-full h-[80%]">
                <DynamicHtmlTag type="div" className="flex items-center lg:justify-between w-full lg:w-11/12 h-full me-auto flex-col lg:flex-row">
                  <DynamicHtmlTag
                    type="div"
                    className="flex items-center flex-row lg:flex-col justify-between w-full lg:w-4/12 lg:gap-8 mt-5 lg:mt-0">
                    <CustomImage src="/images/produit-img1.webp" alt="produit-img1" width={150} height={150} className="w-6/12 lg:w-8/12 me-1" />
                    <CustomImage src="/images/produit-img2.webp" alt="produit-img1" width={150} height={150} className="ms-1 w-6/12 lg:w-8/12" />
                  </DynamicHtmlTag>
                  <DynamicHtmlTag
                    type="div"
                    className="w-full lg:w-8/12 text-2xs lg:text-sm font-semibold leading-relaxed lg:pe-16 overflow-y-scroll lg:overflow-hidden h-full flex items-center">
                    <DynamicHtmlTag type="div">
                      <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                        Facilité d{"'"}utilisation inégalée
                      </HeadingTag>
                      <DynamicHtmlTag type="p" className="mb-4 text-justify">
                        DrVisio a été méticuleusement élaborée pour offrir une expérience utilisateur fluide et intuitive. Qu{"'"}il s{"'"}agisse d
                        {"'"}
                        une première inscription rapide, d{"'"}une prise de rendez-vous en quelques clics ou d{"'"}une navigation transparente au sein
                        de l{"'"}
                        application, tout a été pensé pour simplifier l{"'"}accès aux soins pour tous, quel que soit le niveau de familiarité avec les
                        technologies digitales.
                      </DynamicHtmlTag>
                      <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                        Assistant IA
                      </HeadingTag>

                      <DynamicHtmlTag type="p" className="mb-4 text-justify">
                        Au cœur de notre système, un assistant intelligent basé sur l{"'"}intelligence artificielle joue un rôle pivot dans l{"'"}
                        optimisation de l{"'"}expérience de téléconsultation. Cette technologie de pointe soutient les professionnels de la santé en
                        ébauchant automatiquement les comptes rendus de consultation. Elle analyse les échanges durant la téléconsultation,
                        synthétisant les informations cruciales en notes concises et précises, qui peuvent ensuite être validées par le médecin. Ce
                        processus garantit une documentation claire et cohérente, tout en réduisant significativement le temps consacré à la
                        paperasserie.
                      </DynamicHtmlTag>
                      <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                        Pré-édition d{"'"}ordonnances intelligente
                      </HeadingTag>

                      <DynamicHtmlTag type="p" className="mb-4 text-justify">
                        L{"'"}intelligence artificielle DrVisio va plus loin en proposant une rédaction intelligente d{"'"}ordonnances, élaborées sur
                        la base des protocoles médicaux et des données patients, fournissant ainsi un support décisionnel inestimable. Les ordonnances
                        pré-éditées sont personnalisables et peuvent être ajustées selon le jugement clinique du médecin, garantissant une précision
                        sans faille et une pertinence thérapeutique.
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}

            {currentScreen === 5 && (
              <DynamicHtmlTag type="div" className="screen-2 h-5/6 lg:h-full flex items-start lg:items-center">
                <DynamicHtmlTag type="div" className="lg:w-11/12 flex flex-col h-full overflow-y-scroll lg:overflow-hidden mt-2 lg:mt-0 lg:h-fit">
                  <DynamicHtmlTag type="div" className="flex items-center justify-between w-full flex-col lg:flex-row">
                    <DynamicHtmlTag type="div" className="w-full lg:w-8/12 text-2xs lg:text-sm font-semibold leading-relaxed lg:ps-32 ">
                      <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                        Dashboard intuitif et complet
                      </HeadingTag>
                      <DynamicHtmlTag type="p" className="mb-4 text-justify">
                        Notre tableau de bord est l{"’"}épine dorsale de l{"’"}application, permettant aux médecins de gérer leurs consultations, de
                        visualiser les comptes rendus, d{"’"}accéder aux historiques de traitement et d{"’"}ordonnances avec une fluidité
                        déconcertante. La conception épurée et l{"’"}interface réactive fournissent un support optimal, améliorant ainsi l{"’"}
                        efficacité du soignant et la sécurité des patients
                      </DynamicHtmlTag>
                      <HeadingTag type="h4" className="text-xs lg:text-sm text-customBlue font-semibold">
                        Conformité et sécurité maximum
                      </HeadingTag>
                      <DynamicHtmlTag type="p" className="lg:mb-4 text-justify">
                        La sécurité des données est une priorité absolue. DrVisio répond aux normes et directives les plus strictes telles que HIPAA
                        (Health Insurance Portability and Accountability Act) pour les utilisateurs américains, ainsi que les normes RGPD pour l{"'"}
                        Union européenne. Ces cadres de conformité sont respectés pour assurer une protection maximale des données sensibles des
                        patients.
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="flex items-end flex-row lg:flex-col justify-between w-full lg:w-4/12 lg:gap-5">
                      <CustomImage
                        src="/images/produit-img2.webp"
                        alt="produit-img1"
                        width={200}
                        height={200}
                        className="mx-auto lg:mx-0 lg:ms-auto w-6/12 lg:w-10/12 "
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="lg:mb-4 text-justify text-xs lg:ps-32 text-2xs lg:text-sm font-semibold leading-relaxed mt-3">
                    En bref, DrVisio est l{"'"}alliance parfaite entre technologie de pointe et fonctionnalité, mettant à disposition des
                    professionnels de santé un outil complet et ergonomique pour la gestion de leur pratique médicale. Son tableau de bord intuitif,
                    conforme aux normes internationales de sécurité, en fait un partenaire de choix pour les praticiens souhaitant optimiser leur
                    efficacité et la sécurité de leurs patients. DrVisio peut propulser votre pratique médicale dans une nouvelle ère de la
                    télémédecine.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}

            {currentScreen === 6 && (
              <DynamicHtmlTag type="div" className="screen-1 h-full">
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <CustomImage src="/images/logos/logoBlue.png" width={100} height={100} alt="logo" className="mt-12 lg:hidden" />
                  <HeadingTag type="h4" className="w-32 lg:w-40 font-bold text-xs lg:text-lg lg:ms-5 lg:mt-0">
                    Notre marché et nos propositions de valeur
                  </HeadingTag>
                  <DynamicHtmlTag type="p" className="w-6/12 text-md mx-auto font-semibold -mt-10 hidden lg:block text-center">
                    Notre société, DrVisio, se positionne à l{"'"}avant-garde de la digitalisation des services de santé par le biais de la
                    téléconsultation, en créant des ponts numériques entre les professionnels de santé et les patients.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
                <DynamicHtmlTag
                  type="div"
                  className="flex items-end lg:items-center w-full lg:w-10/12 mx-auto -mt-12 lg:mt-8 gap-x-20 flex-col-reverse lg:flex-row">
                  <DynamicHtmlTag type="div" className="lg:w-8/12">
                    <DynamicHtmlTag type="p" className="font-semibold text-xs lg:text-sm my-4 text-justify">
                      Notre proposition de valeur réside dans la mise à disposition d{"'"}une plateforme de santé intuitive, sécurisée et complète,
                      qui répond aux impératifs d{"'"}immédiateté et de flexibilité des soins médicaux contemporains.
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="p" className="font-semibold text-xs lg:text-sm my-4 text-justify">
                      Notre proposition de valeur réside dans la mise à disposition d{"'"}une plateforme de santé intuitive, sécurisée et complète,
                      qui répond aux impératifs d{"'"}immédiateté et de flexibilité des soins médicaux contemporains.
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>

                  <DynamicHtmlTag type="p" className="w-full text-2xs mx-auto font-semibold my-4 lg:hidden text-center">
                    Notre société, DrVisio, se positionne à l{"'"}avant-garde de la digitalisation des services de santé par le biais de la
                    téléconsultation, en créant des ponts numériques entre les professionnels de santé et les patients.
                  </DynamicHtmlTag>
                  <CustomImage src="/images/marché-img.png" alt="marché-img" width={450} height={200} className="w-7/12 lg:w-4/12" />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}
            {currentScreen === 7 && (
              <DynamicHtmlTag type="div" className="screen-2 h-5/6 lg:h-full flex items-start lg:items-center">
                <DynamicHtmlTag type="div" className="lg:w-11/12 flex flex-col h-full overflow-y-scroll lg:overflow-hidden mt-2 lg:mt-0">
                  <DynamicHtmlTag type="div" className="flex items-center justify-between w-full flex-col lg:flex-row-reverse">
                    <DynamicHtmlTag type="div" className="w-full lg:w-8/12 text-2xs lg:text-sm font-semibold leading-relaxed lg:ps-16">
                      <DynamicHtmlTag type="p" className="mb-4 text-justify">
                        Sur le marché B2B, notre vision est holistique et inclus les entreprises de toute envergure, offrant à leurs employés l{"'"}
                        avantage d{"'"}une accessibilité aux soins sans frontières physiques, attribut essentiel pour une main-d{"'"}œuvre de plus en
                        plus nomade et télétravaillant. L{"'"}ajout de notre service à leur portefeuille de prestations sociales représente pour eux
                        un atout stratégique, renforçant leur image de marque autant qu{"'"}augmentant la satisfaction et la productivité des employés
                        grâce à une gestion optimisée de leur santé.
                      </DynamicHtmlTag>
                      <DynamicHtmlTag type="p" className="lg:mb-4 text-justify">
                        Concernant l{"'"}expansion de notre offre en dehors du cadre des entreprises, nos projets incluent l{"'"}intégration de nos
                        solutions au sein des collectivités territoriales et des établissements de santé comme les cliniques et les hôpitaux, oeuvrant
                        ainsi à la réduction des inégalités d{"'"}accès aux soins. Les pharmacies et les campus universitaires représentent également
                        des axes de croissance significatifs, où nos {"'"}box{"'"} de consultation à distance seront des relais physiques essentiels
                        dans l{"'"}
                        échiquier de l{"'"}accès élargi à la santé.
                      </DynamicHtmlTag>
                    </DynamicHtmlTag>
                    <DynamicHtmlTag type="div" className="flex items-end flex-row lg:flex-col justify-between w-full lg:w-4/12 lg:gap-5">
                      <CustomImage
                        src="/images/marché-img2.png"
                        alt="produit-img1"
                        width={200}
                        height={200}
                        className="lg:ms-1 w-6/12 lg:w-10/12 m-auto lg:mx-0"
                      />
                    </DynamicHtmlTag>
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="lg:mb-4 text-justify lg:ps-16 text-2xs lg:text-sm font-semibold leading-relaxed">
                    L{"'"}innovation est la pierre angulaire de DrVisio. Nous offrons des abonnements souples adaptés aux besoins spécifiques de
                    chaque entité, tout en veillant à l{"'"}implantation de nos postes de consultation à distance. Ces installations, véritables
                    vitrines technologiques, sont conçues pour fonctionner comme des mini-cliniques autonomes, disposant des derniers progrès en
                    matière de connectivité et d{"'"}outils de diagnostic, et sont un pas de plus vers une médecine préventive et integrée dans la vie
                    quotidienne des individus.
                  </DynamicHtmlTag>
                  <DynamicHtmlTag type="p" className="lg:mb-4 text-justify lg:ps-16 text-2xs lg:text-sm font-semibold leading-relaxed">
                    L{"'"}innovation est la pierre angulaire de DrVisio. Nous offrons des abonnements souples adaptés aux besoins spécifiques de
                    chaque entité, tout en veillant à l{"'"}implantation de nos postes de consultation à distance. Ces installations, véritables
                    vitrines technologiques, sont conçues pour fonctionner comme des mini-cliniques autonomes, disposant des derniers progrès en
                    matière de connectivité et d{"'"}outils de diagnostic, et sont un pas de plus vers une médecine préventive et integrée dans la vie
                    quotidienne des individus.
                  </DynamicHtmlTag>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            )}
            {/* Navigation buttons */}

            <DynamicHtmlTag type="div" className="flex flex-col items-center mx-auto lg:mt-auto pb-5">
              <CustomLabel className="font-semibold text-2xs lg:text-md my-3">
                {currentScreen === 1
                  ? "Aperçu de l’entreprise"
                  : currentScreen === 2
                    ? "Notre Produit"
                    : currentScreen === 3
                      ? "Notre service"
                      : currentScreen === 4
                        ? "Notre service"
                        : currentScreen === 5
                          ? "Notre Marché"
                          : currentScreen === 6
                            ? "Nos propositions de valeur"
                            : currentScreen === 7
                              ? "Statistiques de l’entreprise"
                              : "Aperçu de l’entreprise"}
              </CustomLabel>
              <DynamicHtmlTag type="div" className="flex gap-3">
                <CustomButton type="button" className="disabled:opacity-20 rotate-180" onClick={handlePrev} disabled={currentScreen === 1}>
                  <MdKeyboardArrowDown className="custom-grey-btn w-8 h-8 p-1 rounded-full flex items-center justify-center" />
                </CustomButton>
                <CustomButton type="button" className="disabled:opacity-20" onClick={handleNext} disabled={currentScreen === 7}>
                  <MdKeyboardArrowDown className="custom-grey-btn w-8 h-8 p-1 rounded-full flex items-center justify-center" />
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>

            {/* Navigation buttons */}
            <DynamicHtmlTag type="div" className="absolute right-10 h-1/2 top-1/4 p-3 lg:flex hidden flex-col items-center justify-center">
              <DynamicHtmlTag type="div" className="flex flex-col items-center justify-center gap-y-3">
                <CustomButton type="button" className="disabled:opacity-20" onClick={handlePrev} disabled={currentScreen === 1}>
                  <MdKeyboardArrowDown className="prev-screen patient-custom-grey-btn w-8 h-8 p-1 rounded-full flex items-center justify-center rotate-180" />
                </CustomButton>
                <DynamicHtmlTag type="span" className="bg-gray-700 h-32 p-[0.5px]" />
                <CustomButton type="button" className="disabled:opacity-20" onClick={handleNext} disabled={currentScreen === 7}>
                  <MdKeyboardArrowDown className="next-screen patient-custom-grey-btn w-8 h-8 p-1 rounded-full flex items-center justify-center" />
                </CustomButton>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>

          {/* footer Start  */}
          <DynamicHtmlTag type="div" className="bg-[#EFF1F4] w-full sticky bottom-0 p-2">
            <DynamicHtmlTag
              type="div"
              className="w-full lg:w-11/12 mx-auto font-semibold text-dynamic-size md:text-2xs lg:text-xs leading-relaxed flex justify-between gap-2 lg:gap-6">
              <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row lg:w-2/6 lg:justify-between">
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <CustomLink href="/" className="sm:text-[12px]">
                    Mentions légales
                  </CustomLink>
                  <CustomLink href="/" className="sm:text-[12px]">
                    Politique de confidentialité
                  </CustomLink>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <CustomLink href="/" className="sm:text-[12px]">
                    Conditions générales d’utilisation
                  </CustomLink>
                  <CustomLink href="/" className="sm:text-[12px]">
                    Notice d’Information et de consentement
                  </CustomLink>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row w-2/6 lg:justify-between">
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <CustomLink href="/" className="sm:text-[12px]">
                    Cookies
                  </CustomLink>
                  <CustomLink href="/" className="sm:text-[12px]">
                    Référencement
                  </CustomLink>
                </DynamicHtmlTag>
                <DynamicHtmlTag type="div" className="flex flex-col">
                  <CustomLink href="/" className="sm:text-[12px]">
                    Tarifs
                  </CustomLink>
                  <CustomLink href="/" className="sm:text-[12px]">
                    Accessibilité du site : Conforme
                  </CustomLink>
                </DynamicHtmlTag>
              </DynamicHtmlTag>
              <DynamicHtmlTag type="div" className="flex flex-col lg:flex-row gap-3 w-1/6 lg:items-center lg:justify-end">
                <CustomLink href="/" className="sm:text-[12px]">
                  Suivez-nous !
                </CustomLink>
                <DynamicHtmlTag type="div" className="flex gap-1">
                  <FaFacebookF />
                  <FaInstagram />
                  <FaTwitter />
                  <FaLinkedinIn />
                </DynamicHtmlTag>
              </DynamicHtmlTag>
            </DynamicHtmlTag>
          </DynamicHtmlTag>
          {/* footer End */}
        </DynamicHtmlTag>
      </DynamicHtmlTag>
    </CustomModal>
  );
};
export default ProposModal;
