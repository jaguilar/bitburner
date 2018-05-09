import {Bladeburner}                            from "./Bladeburner.js";
import {CompanyPositions, initCompanies,
        Companies, getJobRequirementText}       from "./Company.js";
import {Corporation}                            from "./CompanyManagement.js";
import {CONSTANTS}                              from "./Constants.js";
import {commitShopliftCrime, commitRobStoreCrime, commitMugCrime,
        commitLarcenyCrime, commitDealDrugsCrime, commitBondForgeryCrime,
        commitTraffickArmsCrime,
        commitHomicideCrime, commitGrandTheftAutoCrime, commitKidnapCrime,
        commitAssassinationCrime, commitHeistCrime, determineCrimeSuccess,
        determineCrimeChanceShoplift, determineCrimeChanceRobStore,
        determineCrimeChanceMug, determineCrimeChanceLarceny,
        determineCrimeChanceDealDrugs, determineCrimeChanceBondForgery,
        determineCrimeChanceTraffickArms,
        determineCrimeChanceHomicide, determineCrimeChanceGrandTheftAuto,
        determineCrimeChanceKidnap, determineCrimeChanceAssassination,
        determineCrimeChanceHeist}              from "./Crimes.js";
import {Engine}                                 from "./engine.js";
import {beginInfiltration}                      from "./Infiltration.js";
import {hasBladeburnerSF}                       from "./NetscriptFunctions.js";
import {Player}                                 from "./Player.js";
import {Server, AllServers, AddToAllServers}    from "./Server.js";
import {purchaseServer,
        purchaseRamForHomeComputer}             from "./ServerPurchases.js";
import {SpecialServerNames, SpecialServerIps}   from "./SpecialServerIps.js";

import {dialogBoxCreate}                        from "../utils/DialogBox.js";
import {clearEventListeners, createElement}     from "../utils/HelperFunctions.js";
import {createRandomIp}                         from "../utils/IPAddress.js";
import numeral                                  from "../utils/numeral.min.js";
import {formatNumber}                           from "../utils/StringHelperFunctions.js";
import {yesNoBoxCreate, yesNoTxtInpBoxCreate,
        yesNoBoxGetYesButton, yesNoBoxGetNoButton,
        yesNoTxtInpBoxGetYesButton, yesNoTxtInpBoxGetNoButton,
        yesNoTxtInpBoxGetInput, yesNoBoxClose,
        yesNoTxtInpBoxClose}                    from "../utils/YesNoBox.js";

/* Display Location Content when visiting somewhere in the World*/
var Locations = {
    //Cities
	Aevum: 			"Aevum",
    //AevumDesc:      ""
	Chongqing: 		"Chongqing",
	Sector12: 		"Sector-12",
	NewTokyo: 		"New Tokyo",
	Ishima: 		"Ishima",
	Volhaven: 		"Volhaven",

    //Aevum Locations
    AevumTravelAgency:          "Aevum Travel Agency",
    AevumSummitUniversity:      "Summit University",
    AevumECorp:                 "ECorp",
    AevumBachmanAndAssociates:  "Bachman & Associates",
    AevumClarkeIncorporated:    "Clarke Incorporated",
    AevumFulcrumTechnologies:   "Fulcrum Technolgies",
    AevumAeroCorp:              "AeroCorp",
    AevumGalacticCybersystems:  "Galactic Cybersystems",
    AevumWatchdogSecurity:      "Watchdog Security",
    AevumRhoConstruction:       "Rho Construction",
    AevumPolice:                "Aevum Police Headquarters",
    AevumNetLinkTechnologies:   "NetLink Technologies",
    AevumCrushFitnessGym:       "Crush Fitness Gym",
    AevumSnapFitnessGym:        "Snap Fitness Gym",
    AevumSlums:                 "Aevum Slums",

    //Chongqing locations
    ChongqingTravelAgency:          "Chongqing Travel Agency",
    ChongqingKuaiGongInternational: "KuaiGong International",
    ChongqingSolarisSpaceSystems:   "Solaris Space Systems",
    ChongqingSlums:                 "Chongqing Slums",

    //Sector 12
    Sector12TravelAgency:       "Sector-12 Travel Agency",
    Sector12RothmanUniversity:  "Rothman University",
    Sector12MegaCorp:           "MegaCorp",
    Sector12BladeIndustries:    "Blade Industries",
    Sector12FourSigma:          "Four Sigma",
    Sector12IcarusMicrosystems: "Icarus Microsystems",
    Sector12UniversalEnergy:    "Universal Energy",
    Sector12DeltaOne:           "DeltaOne",
    Sector12CIA:                "Central Intelligence Agency",
    Sector12NSA:                "National Security Agency",
    Sector12AlphaEnterprises:   "Alpha Enterprises",
    Sector12CarmichaelSecurity: "Carmichael Security",
    Sector12FoodNStuff:         "FoodNStuff",
    Sector12JoesGuns:           "Joe's Guns",
    Sector12IronGym:            "Iron Gym",
    Sector12PowerhouseGym:      "Powerhouse Gym",
    Sector12Slums:              "Sector-12 Slums",
    Sector12CityHall:           "Sector-12 City Hall",

    //New Tokyo
    NewTokyoTravelAgency:           "New Tokyo Travel Agency",
    NewTokyoDefComm:                "DefComm",
    NewTokyoVitaLife:               "VitaLife",
    NewTokyoGlobalPharmaceuticals:  "Global Pharmaceuticals",
    NewTokyoNoodleBar:              "Noodle Bar",
    NewTokyoSlums:                  "New Tokyo Slums",

    //Ishima
    IshimaTravelAgency:         "Ishima Travel Agency",
    IshimaStormTechnologies:    "Storm Technologies",
    IshimaNovaMedical:          "Nova Medical",
    IshimaOmegaSoftware:        "Omega Software",
    IshimaSlums:                "Ishima Slums",

    //Volhaven
    VolhavenTravelAgency:               "Volhaven Travel Agency",
    VolhavenZBInstituteOfTechnology:    "ZB Institute of Technology",
    VolhavenOmniTekIncorporated:        "OmniTek Incorporated",
    VolhavenNWO:                        "NWO",
    VolhavenHeliosLabs:                 "Helios Labs",
    VolhavenOmniaCybersystems:          "Omnia Cybersystems",
    VolhavenLexoCorp:                   "LexoCorp",
    VolhavenSysCoreSecurities:          "SysCore Securities",
    VolhavenCompuTek:                   "CompuTek",
    VolhavenMilleniumFitnessGym:        "Millenium Fitness Gym",
    VolhavenSlums:                      "Volhaven Slums",

    //Generic locations
    Hospital:               "Hospital",
    WorldStockExchange:     "World Stock Exchange",
}

function displayLocationContent() {
	if (Engine.debug) {
		console.log("displayLocationContent() called with location " + Player.location)
	}

    var returnToWorld           = document.getElementById("location-return-to-world-button");

    var locationName            = document.getElementById("location-name");

    var locationInfo            = document.getElementById("location-info");

    var softwareJob             = document.getElementById("location-software-job");
    var softwareConsultantJob   = document.getElementById("location-software-consultant-job")
    var itJob                   = document.getElementById("location-it-job");
    var securityEngineerJob     = document.getElementById("location-security-engineer-job");
    var networkEngineerJob      = document.getElementById("location-network-engineer-job");
    var businessJob             = document.getElementById("location-business-job");
    var businessConsultantJob   = document.getElementById("location-business-consultant-job");
    var securityJob             = document.getElementById("location-security-job");
    var agentJob                = document.getElementById("location-agent-job");
    var employeeJob             = document.getElementById("location-employee-job");
    var employeePartTimeJob     = document.getElementById("location-parttime-employee-job");
    var waiterJob               = document.getElementById("location-waiter-job");
    var waiterPartTimeJob       = document.getElementById("location-parttime-waiter-job");

    var work                    = clearEventListeners("location-work");

	var jobTitle 			    = document.getElementById("location-job-title");
	var jobReputation 		    = document.getElementById("location-job-reputation");
    var companyFavor            = document.getElementById("location-company-favor");
    var locationTxtDiv1         = document.getElementById("location-text-divider-1");
    var locationTxtDiv2         = document.getElementById("location-text-divider-2");
    var locationTxtDiv3         = document.getElementById("location-text-divider-3");

    var gymTrainStr             = document.getElementById("location-gym-train-str");
    var gymTrainDef             = document.getElementById("location-gym-train-def");
    var gymTrainDex             = document.getElementById("location-gym-train-dex");
    var gymTrainAgi             = document.getElementById("location-gym-train-agi");

    var studyComputerScience    = document.getElementById("location-study-computer-science");
    var classDataStructures     = document.getElementById("location-data-structures-class");
    var classNetworks           = document.getElementById("location-networks-class");
    var classAlgorithms         = document.getElementById("location-algorithms-class");
    var classManagement         = document.getElementById("location-management-class");
    var classLeadership         = document.getElementById("location-leadership-class");

    var purchase2gb             = document.getElementById("location-purchase-2gb");
    var purchase4gb             = document.getElementById("location-purchase-4gb");
    var purchase8gb             = document.getElementById("location-purchase-8gb");
    var purchase16gb            = document.getElementById("location-purchase-16gb");
    var purchase32gb            = document.getElementById("location-purchase-32gb");
    var purchase64gb            = document.getElementById("location-purchase-64gb");
    var purchase128gb           = document.getElementById("location-purchase-128gb");
    var purchase256gb           = document.getElementById("location-purchase-256gb");
    var purchase512gb           = document.getElementById("location-purchase-512gb");
    var purchase1tb             = document.getElementById("location-purchase-1tb");
    var purchaseTor             = document.getElementById("location-purchase-tor");
    var purchaseHomeRam         = document.getElementById("location-purchase-home-ram");
    var purchaseHomeCores       = document.getElementById("location-purchase-home-cores");

    var travelAgencyText        = document.getElementById("location-travel-agency-text");
    var travelToAevum           = document.getElementById("location-travel-to-aevum");
    var travelToChongqing       = document.getElementById("location-travel-to-chongqing");
    var travelToSector12        = document.getElementById("location-travel-to-sector12");
    var travelToNewTokyo        = document.getElementById("location-travel-to-newtokyo");
    var travelToIshima          = document.getElementById("location-travel-to-ishima");
    var travelToVolhaven        = document.getElementById("location-travel-to-volhaven");

    var infiltrate              = clearEventListeners("location-infiltrate");

    var hospitalTreatment       = document.getElementById("location-hospital-treatment");

    var slumsDescText           = document.getElementById("location-slums-description");
    var slumsShoplift           = document.getElementById("location-slums-shoplift");
    var slumsRobStore           = document.getElementById("location-slums-rob-store");
    var slumsMug                = document.getElementById("location-slums-mug");
    var slumsLarceny            = document.getElementById("location-slums-larceny");
    var slumsDealDrugs          = document.getElementById("location-slums-deal-drugs");
    var slumsBondForgery        = document.getElementById("location-slums-bond-forgery");
    var slumsTrafficArms        = document.getElementById("location-slums-traffic-arms");
    var slumsHomicide           = document.getElementById("location-slums-homicide");
    var slumsGta                = document.getElementById("location-slums-gta");
    var slumsKidnap             = document.getElementById("location-slums-kidnap");
    var slumsAssassinate        = document.getElementById("location-slums-assassinate");
    var slumsHeist              = document.getElementById("location-slums-heist");

    var cityHallCreateCorporation   = document.getElementById("location-cityhall-create-corporation");

    var nsaBladeburner = document.getElementById("location-nsa-bladeburner");

    var loc = Player.location;

    returnToWorld.addEventListener("click", function() {
        Engine.loadWorldContent();
    });

    locationName.innerHTML = loc;
    locationName.style.display = "block";

    locationInfo.style.display = "block";

    softwareJob.style.display = "none";
    softwareConsultantJob.style.display = "none";
    itJob.style.display = "none";
    securityEngineerJob.style.display = "none";
    networkEngineerJob.style.display = "none";
    businessJob.style.display = "none";
    businessConsultantJob.style.display = "none";
    securityJob.style.display = "none";
    agentJob.style.display = "none";
    employeeJob.style.display = "none";
    employeePartTimeJob.style.display = "none";
    waiterJob.style.display = "none";
    waiterPartTimeJob.style.display = "none";

    softwareJob.innerHTML = "Apply for Software Job";
    softwareConsultantJob.innerHTML = "Apply for a Software Consultant job";
    itJob.innerHTML = "Apply for IT Job";
    securityEngineerJob.innerHTML = "Apply for Security Engineer Job";
    networkEngineerJob.innerHTML = "Apply for Network Engineer Job";
    businessJob.innerHTML = "Apply for Business Job";
    businessConsultantJob.innerHTML = "Apply for a Business Consultant Job";
    securityJob.innerHTML = "Apply for Security Job";
    agentJob.innerHTML = "Apply for Agent Job";
    employeeJob.innerHTML = "Apply to be an Employee";
    employeePartTimeJob.innerHTML = "Apply to be a Part-time Employee";
    waiterJob.innerHTML = "Apply to be a Waiter";
    waiterPartTimeJob.innerHTML = "Apply to be a Part-time Waiter"

    work.style.display = "none";

    gymTrainStr.style.display = "none";
    gymTrainDef.style.display = "none";
    gymTrainDex.style.display = "none";
    gymTrainAgi.style.display = "none";

    studyComputerScience.style.display = "none";
    classDataStructures.style.display = "none";
    classNetworks.style.display = "none";
    classAlgorithms.style.display = "none";
    classManagement.style.display = "none";
    classLeadership.style.display = "none";

    purchase2gb.style.display = "none";
    purchase4gb.style.display = "none";
    purchase8gb.style.display = "none";
    purchase16gb.style.display = "none";
    purchase32gb.style.display = "none";
    purchase64gb.style.display = "none";
    purchase128gb.style.display = "none";
    purchase256gb.style.display = "none";
    purchase512gb.style.display = "none";
    purchase1tb.style.display = "none";
    purchaseTor.style.display = "none";
    purchaseHomeRam.style.display = "none";
    purchaseHomeCores.style.display = "none";

    purchase2gb.innerHTML = "Purchase 2GB Server - $" + formatNumber(2*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase4gb.innerHTML = "Purchase 4GB Server - $" + formatNumber(4*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase8gb.innerHTML = "Purchase 8GB Server - $" + formatNumber(8*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase16gb.innerHTML = "Purchase 16GB Server - $" + formatNumber(16*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase32gb.innerHTML = "Purchase 32GB Server - $" + formatNumber(32*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase64gb.innerHTML = "Purchase 64GB Server - $" + formatNumber(64*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase128gb.innerHTML = "Purchase 128GB Server - $" + formatNumber(128*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase256gb.innerHTML = "Purchase 256GB Server - $" + formatNumber(256*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase512gb.innerHTML = "Purchase 512GB Server - $" + formatNumber(512*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchase1tb.innerHTML = "Purchase 1TB Server - $" + formatNumber(1024*CONSTANTS.BaseCostFor1GBOfRamServer, 2);
    purchaseTor.innerHTML = "Purchase TOR Router - $" + formatNumber(CONSTANTS.TorRouterCost, 2);

    travelAgencyText.style.display = "none";
    travelToAevum.style.display = "none";
    travelToChongqing.style.display = "none";
    travelToSector12.style.display = "none";
    travelToNewTokyo.style.display = "none";
    travelToIshima.style.display = "none";
    travelToVolhaven.style.display = "none";

    infiltrate.style.display = "none";

    hospitalTreatment.style.display = "none";

    slumsDescText.style.display = "none";
    slumsShoplift.style.display = "none";
    slumsRobStore.style.display = "none";
    slumsMug.style.display = "none";
    slumsLarceny.style.display = "none";
    slumsDealDrugs.style.display = "none";
    slumsBondForgery.style.display = "none";
    slumsTrafficArms.style.display = "none";
    slumsHomicide.style.display = "none";
    slumsGta.style.display = "none";
    slumsKidnap.style.display = "none";
    slumsAssassinate.style.display = "none";
    slumsHeist.style.display = "none";

    cityHallCreateCorporation.style.display = "none";
    nsaBladeburner.style.display = "none";

    //Check if the player is employed at this Location. If he is, display the "Work" button,
    //update the job title, etc.
    if (loc != "" && loc === Player.companyName) {
        var company = Companies[loc];

        jobTitle.style.display = "block";
        jobReputation.style.display = "inline";
        companyFavor.style.display = "inline";
        locationTxtDiv1.style.display = "block";
        locationTxtDiv2.style.display = "block";
        locationTxtDiv3.style.display = "block";
        jobTitle.innerHTML = "Job Title: " + Player.companyPosition.positionName;
        var repGain = company.getFavorGain();
        if (repGain.length != 2) {repGain = 0;}
        repGain = repGain[0];
        jobReputation.innerHTML = "Company reputation: " + formatNumber(company.playerReputation, 4) +
                                  "<span class='tooltiptext'>You will earn " +
                                  formatNumber(repGain, 4) +
                                  " faction favor upon resetting after installing an Augmentation</span>";
        companyFavor.innerHTML = "Company Favor: " + formatNumber(company.favor, 4) +
                                 "<span class='tooltiptext'>Company favor increases the rate at which " +
                                 "you earn reputation for this company by 1% per favor. Company favor " +
                                 "is gained whenever you reset after installing an Augmentation. The amount of " +
                                 "favor you gain depends on how much reputation you have with the company</span>";
        work.style.display = "block";

        var currPos = Player.companyPosition;

        work.addEventListener("click", function() {
            if (currPos.isPartTimeJob()) {
                Player.startWorkPartTime();
            } else {
                Player.startWork();
            }
            return false;
        });

        //Change the text for the corresponding position from "Apply for X Job" to "Apply for promotion"
        if (currPos.isSoftwareJob()) {
            softwareJob.innerHTML = "Apply for a promotion (Software)";
        } else if (currPos.isSoftwareConsultantJob()) {
            softwareConsultantJob.innerHTML = "Apply for a promotion (Software Consultant)";
        } else if (currPos.isITJob()) {
            itJob.innerHTML = "Apply for a promotion (IT)";
        } else if (currPos.isSecurityEngineerJob()) {
            securityEngineerJob.innerHTML = "Apply for a promotion (Security Engineer)";
        } else if (currPos.isNetworkEngineerJob()) {
            networkEngineerJob.innerHTML = "Apply for a promotion (Network Engineer)";
        } else if (currPos.isBusinessJob()) {
            businessJob.innerHTML = "Apply for a promotion (Business)";
        } else if (currPos.isBusinessConsultantJob()) {
            businessConsultantJob.innerHTML = "Apply for a promotion (Business Consultant)";
        } else if (currPos.isSecurityJob()) {
            securityJob.innerHTML = "Apply for a promotion (Security)";
        } else if (currPos.isAgentJob()) {
            agentJob.innerHTML = "Apply for a promotion (Agent)";
        }
    } else {
		jobTitle.style.display = "none";
		jobReputation.style.display = "none";
        companyFavor.style.display = "none";
        locationTxtDiv1.style.display = "none";
        locationTxtDiv2.style.display = "none";
        locationTxtDiv3.style.display = "none";
	}

    //Calculate hospital Cost
    if (Player.hp < 0) {Player.hp = 0;}
    var hospitalTreatmentCost = (Player.max_hp - Player.hp) * CONSTANTS.HospitalCostPerHp;

    //Set tooltip for job requirements
    setJobRequirementTooltip(loc, CompanyPositions.SoftwareIntern, softwareJob);
    setJobRequirementTooltip(loc, CompanyPositions.SoftwareConsultant, softwareConsultantJob);
    setJobRequirementTooltip(loc, CompanyPositions.ITIntern, itJob);
    setJobRequirementTooltip(loc, CompanyPositions.SecurityEngineer, securityEngineerJob);
    setJobRequirementTooltip(loc, CompanyPositions.NetworkEngineer, networkEngineerJob);
    setJobRequirementTooltip(loc, CompanyPositions.BusinessIntern, businessJob);
    setJobRequirementTooltip(loc, CompanyPositions.BusinessConsultant, businessConsultantJob);
    setJobRequirementTooltip(loc, CompanyPositions.SecurityGuard, securityJob);
    setJobRequirementTooltip(loc, CompanyPositions.FieldAgent, agentJob);
    setJobRequirementTooltip(loc, CompanyPositions.Employee, employeeJob);
    setJobRequirementTooltip(loc, CompanyPositions.PartTimeEmployee, employeePartTimeJob);
    setJobRequirementTooltip(loc, CompanyPositions.Waiter, waiterJob);
    setJobRequirementTooltip(loc, CompanyPositions.PartTimeWaiter, waiterPartTimeJob);

    switch (loc) {
        case Locations.AevumTravelAgency:
            travelAgencyText.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToSector12.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToIshima.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;

        case Locations.AevumSummitUniversity:
            var costMult = 4, expMult = 3;
            displayUniversityLocationContent(costMult);
            setUniversityLocationButtons(costMult, expMult);
            break;

        case Locations.AevumECorp:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";

            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchase512gb.style.display = "block";
            purchase1tb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumECorp,
                                6000, 116, 150, 8.5);
            break;

        case Locations.AevumBachmanAndAssociates:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumBachmanAndAssociates,
                                1500, 42, 60, 5.75);
            break;

        case Locations.AevumClarkeIncorporated:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumClarkeIncorporated,
                                2400, 34, 75, 5.4);
            break;

        case Locations.AevumFulcrumTechnologies:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";

            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchase512gb.style.display = "block";
            purchase1tb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumFulcrumTechnologies,
                                6000, 96, 100, 9);
            break;

        case Locations.AevumAeroCorp:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumAeroCorp,
                                2000, 32, 50, 6.3);
            break;

        case Locations.AevumGalacticCybersystems:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumGalacticCybersystems,
                                1400, 30, 50, 5.3);
            break;

        case Locations.AevumWatchdogSecurity:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumWatchdogSecurity,
                                850, 16, 30, 4.5);
            break;

        case Locations.AevumRhoConstruction:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumRhoConstruction,
                                600, 12, 20, 2.7);
            break;

        case Locations.AevumPolice:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumPolice,
                                700, 14, 25, 3.2);
            break;

        case Locations.AevumNetLinkTechnologies:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";

            purchase2gb.style.display = "block";
            purchase4gb.style.display = "block";
            purchase8gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.AevumNetLinkTechnologies,
                                160, 10, 15, 1.8);
            break;

        case Locations.AevumCrushFitnessGym:
            var costMult = 2, expMult = 1.5;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
            break;

        case Locations.AevumSnapFitnessGym:
            var costMult = 6, expMult = 4;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
            break;

        case Locations.ChongqingTravelAgency:
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToSector12.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToIshima.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;

        case Locations.ChongqingKuaiGongInternational:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.ChongqingKuaiGongInternational,
                                5500, 48, 100, 9);
            break;

        case Locations.ChongqingSolarisSpaceSystems:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.ChongqingSolarisSpaceSystems,
                                3600, 26, 75, 8.6);
            break;


        case Locations.Sector12TravelAgency:
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToIshima.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;

        case Locations.Sector12RothmanUniversity:
            var costMult = 3, expMult = 2;
            displayUniversityLocationContent(costMult);
            setUniversityLocationButtons(costMult, expMult);
            break;

        case Locations.Sector12MegaCorp:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12MegaCorp,
                                6000, 114, 125, 9.8);
            break;

        case Locations.Sector12BladeIndustries:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12BladeIndustries,
                                3000, 46, 100, 6.7);
            break;

        case Locations.Sector12FourSigma:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12FourSigma,
                                1500, 58, 100, 10.2);
            break;

        case Locations.Sector12IcarusMicrosystems:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12IcarusMicrosystems,
                                900, 32, 70, 7.8);
            break;

        case Locations.Sector12UniversalEnergy:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12UniversalEnergy,
                                775, 24, 50, 6.3);
            break;

        case Locations.Sector12DeltaOne:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12DeltaOne,
                                1200, 38, 75, 6.3);
            break;

        case Locations.Sector12CIA:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12CIA,
                                1450, 44, 80, 7.6);
            break;

        case Locations.Sector12NSA:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            if (Player.bitNodeN === 6 || hasBladeburnerSF === true) {
                if (Player.bladeburner instanceof Bladeburner) {
                    //Note: Can't infiltrate NSA when part of bladeburner
                    nsaBladeburner.innerText = "Enter Bladeburner Headquarters";
                } else {
                    setInfiltrateButton(infiltrate, Locations.Sector12NSA,
                                        1400, 40, 80, 7.2);
                    nsaBladeburner.innerText = "Apply to Bladeburner Division";
                }
                nsaBladeburner.style.display = "block";
            } else {
                setInfiltrateButton(infiltrate, Locations.Sector12NSA,
                                    1400, 40, 80, 7.2);
            }
            break;

        case Locations.Sector12AlphaEnterprises:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            businessJob.style.display = "block";
            purchase2gb.style.display = "block";
            purchase4gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12AlphaEnterprises,
                                250, 14, 40, 2.7);
            break;

        case Locations.Sector12CarmichaelSecurity:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            agentJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12CarmichaelSecurity,
                                500, 18, 60, 2.7);
            break;

        case Locations.Sector12FoodNStuff:
			locationInfo.innerHTML = Companies[loc].info;

            employeeJob.style.display = "block";
            employeePartTimeJob.style.display = "block";
            break;

        case Locations.Sector12JoesGuns:
			locationInfo.innerHTML = Companies[loc].info;

            employeeJob.style.display = "block";
            employeePartTimeJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.Sector12JoesGuns,
                                120, 8, 20, 2.2);
            break;

        case Locations.Sector12IronGym:
            var costMult = 1, expMult = 1;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
            break;

        case Locations.Sector12PowerhouseGym:
            var costMult = 10, expMult = 7.5;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
            break;

        case Locations.Sector12CityHall:
            cityHallCreateCorporation.style.display = "block";
            if (Player.corporation instanceof Corporation) {
                cityHallCreateCorporation.className = "a-link-button-inactive";
            } else {
                cityHallCreateCorporation.className = "a-link-button";
            }
            break;

        case Locations.NewTokyoTravelAgency:
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToSector12.style.display = "block";
            travelToIshima.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;

        case Locations.NewTokyoDefComm:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.NewTokyoDefComm,
                                1300, 28, 70, 5.4);
            break;

        case Locations.NewTokyoVitaLife:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.NewTokyoVitaLife,
                                750, 22, 100, 5);
            break;

        case Locations.NewTokyoGlobalPharmaceuticals:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.NewTokyoGlobalPharmaceuticals,
                                900, 24, 80, 5.4);
            break;

        case Locations.NewTokyoNoodleBar:
			locationInfo.innerHTML = Companies[loc].info;

            waiterJob.style.display = "block";
            waiterPartTimeJob.style.display = "block";
            break;

        case Locations.IshimaTravelAgency:
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToSector12.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToVolhaven.style.display = "block";
            break;

        case Locations.IshimaStormTechnologies:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "none";
            agentJob.style.display = "none";
            employeeJob.style.display = "none";
            waiterJob.style.display = "none";

            purchase32gb.style.display = "block";
            purchase64gb.style.display = "block";
            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.IshimaStormTechnologies,
                                700, 24, 100, 5.9);
            break;

        case Locations.IshimaNovaMedical:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.IshimaNovaMedical,
                                600, 20, 50, 4.5);
            break;

        case Locations.IshimaOmegaSoftware:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            businessJob.style.display = "block";

            purchase4gb.style.display = "block";
            purchase8gb.style.display = "block";
            purchase16gb.style.display = "block";
            purchase32gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.IshimaOmegaSoftware,
                                200, 10, 40, 2.3);
            break;

        case Locations.VolhavenTravelAgency:
            travelAgencyText.style.display = "block";
            travelToAevum.style.display = "block";
            travelToChongqing.style.display = "block";
            travelToSector12.style.display = "block";
            travelToNewTokyo.style.display = "block";
            travelToIshima.style.display = "block";
            break;

        case Locations.VolhavenZBInstituteOfTechnology:
            var costMult = 5, expMult = 4;
            displayUniversityLocationContent(costMult);
            setUniversityLocationButtons(costMult, expMult);
            break;

        case Locations.VolhavenOmniTekIncorporated:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";

            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchase512gb.style.display = "block";
            purchase1tb.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenOmniTekIncorporated,
                                1500, 44, 100, 6.3);
            break;

        case Locations.VolhavenNWO:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenNWO,
                                1800, 56, 200, 7.2);
            break;

        case Locations.VolhavenHeliosLabs:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenHeliosLabs,
                                1200, 28, 75, 5.4);
            break;

        case Locations.VolhavenOmniaCybersystems:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenOmniaCybersystems,
                                900, 28, 90, 5.8);
            break;

        case Locations.VolhavenLexoCorp:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            businessJob.style.display = "block";
            securityJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenLexoCorp,
                                500, 14, 40, 3.1);
            break;

        case Locations.VolhavenSysCoreSecurities:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenSysCoreSecurities,
                                600, 16, 50, 3.6);
            break;

        case Locations.VolhavenCompuTek:
			locationInfo.innerHTML = Companies[loc].info;

            softwareJob.style.display = "block";
            softwareConsultantJob.style.display = "block";
            itJob.style.display = "block";
            securityEngineerJob.style.display = "block";
            networkEngineerJob.style.display = "block";

            purchase8gb.style.display = "block";
            purchase16gb.style.display = "block";
            purchase32gb.style.display = "block";
            purchase64gb.style.display = "block";
            purchase128gb.style.display = "block";
            purchase256gb.style.display = "block";
            purchaseTor.style.display = "block";
            purchaseHomeRam.style.display = "block";
            purchaseHomeCores.style.display = "block";
            setInfiltrateButton(infiltrate, Locations.VolhavenCompuTek,
                                300, 12, 35, 3.1);
            break;

        case Locations.VolhavenMilleniumFitnessGym:
            var costMult = 3, expMult = 2.5;
            displayGymLocationContent(costMult);
            setGymLocationButtons(costMult, expMult);
            break;

        //All Slums
        case Locations.AevumSlums:
        case Locations.ChongqingSlums:
        case Locations.Sector12Slums:
        case Locations.NewTokyoSlums:
        case Locations.IshimaSlums:
        case Locations.VolhavenSlums:
            var shopliftChance = determineCrimeChanceShoplift();
            var robStoreChance = determineCrimeChanceRobStore();
            var mugChance = determineCrimeChanceMug();
            var larcenyChance = determineCrimeChanceLarceny();
            var drugsChance = determineCrimeChanceDealDrugs();
            var bondChance = determineCrimeChanceBondForgery();
            var armsChance = determineCrimeChanceTraffickArms();
            var homicideChance = determineCrimeChanceHomicide();
            var gtaChance = determineCrimeChanceGrandTheftAuto();
            var kidnapChance = determineCrimeChanceKidnap();
            var assassinateChance = determineCrimeChanceAssassination();
            var heistChance = determineCrimeChanceHeist();

            slumsDescText.style.display = "block";
            slumsShoplift.style.display = "block";
            slumsShoplift.innerHTML = "Shoplift (" + (shopliftChance*100).toFixed(3) + "% chance of success)";
            slumsShoplift.innerHTML += '<span class="tooltiptext"> Attempt to shoplift from a low-end retailer </span>';
            slumsRobStore.style.display = "block";
            slumsRobStore.innerHTML = "Rob store(" + (robStoreChance*100).toFixed(3) + "% chance of success)";
            slumsRobStore.innerHTML += '<span class="tooltiptext">Attempt to commit armed robbery on a high-end store </span>';
            slumsMug.style.display = "block";
            slumsMug.innerHTML = "Mug someone (" + (mugChance*100).toFixed(3) + "% chance of success)";
            slumsMug.innerHTML += '<span class="tooltiptext"> Attempt to mug a random person on the street </span>';
            slumsLarceny.style.display = "block";
            slumsLarceny.innerHTML = "Larceny (" + (larcenyChance*100).toFixed(3) + "% chance of success)";
            slumsLarceny.innerHTML +="<span class='tooltiptext'> Attempt to rob property from someone's house </span>";
            slumsDealDrugs.style.display = "block";
            slumsDealDrugs.innerHTML = "Deal Drugs (" + (drugsChance*100).toFixed(3) + "% chance of success)";
            slumsDealDrugs.innerHTML += '<span class="tooltiptext"> Attempt to deal drugs </span>';
            slumsBondForgery.style.display = "block";
            slumsBondForgery.innerHTML = "Bond Forgery(" + (bondChance*100).toFixed(3) + "% chance of success)";
            slumsBondForgery.innerHTML += "<span class='tooltiptext'> Attempt to forge corporate bonds</span>";
            slumsTrafficArms.style.display = "block";
            slumsTrafficArms.innerHTML = "Traffick Illegal Arms (" + (armsChance*100).toFixed(3) + "% chance of success)";
            slumsTrafficArms.innerHTML += '<span class="tooltiptext"> Attempt to smuggle illegal arms into the city and sell them to gangs and criminal organizations </span>';
            slumsHomicide.style.display = "block";
            slumsHomicide.innerHTML = "Homicide (" + (homicideChance*100).toFixed(3) + "% chance of success)";
            slumsHomicide.innerHTML += '<span class="tooltiptext"> Attempt to murder a random person on the street</span>';
            slumsGta.style.display = "block";
            slumsGta.innerHTML = "Grand Theft Auto (" + (gtaChance*100).toFixed(3) + "% chance of success)";
            slumsGta.innerHTML += '<span class="tooltiptext"> Attempt to commit grand theft auto </span>';
            slumsKidnap.style.display = "block";
            slumsKidnap.innerHTML = "Kidnap and Ransom (" + (kidnapChance*100).toFixed(3) + "% chance of success)";
            slumsKidnap.innerHTML += '<span class="tooltiptext"> Attempt to kidnap and ransom a high-profile target </span>';
            slumsAssassinate.style.display = "block";
            slumsAssassinate.innerHTML = "Assassinate (" + (assassinateChance*100).toFixed(3) + "% chance of success)";
            slumsAssassinate.innerHTML += '<span class="tooltiptext"> Attempt to assassinate a high-profile target </span>';
            slumsHeist.style.display = "block";
            slumsHeist.innerHTML = "Heist (" + (heistChance*100).toFixed(3) + "% chance of success)";
            slumsHeist.innerHTML += '<span class="tooltiptext"> Attempt to pull off the ultimate heist </span>';
            break;

        //Hospital
        case Locations.Hospital:
            hospitalTreatment.innerText = "Get treatment for wounds - $" + formatNumber(hospitalTreatmentCost, 2).toString();
            hospitalTreatment.style.display = "block";
            break;

        default:
            console.log("ERROR: INVALID LOCATION");
    }

    //Make the "Apply to be Employee and Waiter" texts disappear if you already hold the job
    //Includes part-time stuff
    if (loc == Player.companyName) {
        var currPos = Player.companyPosition;

        if (currPos.positionName == CompanyPositions.Employee.positionName) {
            employeeJob.style.display = "none";
        } else if (currPos.positionName == CompanyPositions.Waiter.positionName) {
            waiterJob.style.display = "none";
        } else if (currPos.positionName == CompanyPositions.PartTimeEmployee.positionName) {
            employeePartTimeJob.style.display = "none";
        } else if (currPos.positionName == CompanyPositions.PartTimeWaiter.positionName) {
            waiterPartTimeJob.style.display = "none";
        }
    }
}

function initLocationButtons() {
    //Buttons to travel to different locations in World
    let aevumTravelAgency = document.getElementById("aevum-travelagency");
    aevumTravelAgency.addEventListener("click", function() {
        Player.location = Locations.AevumTravelAgency;
        Engine.loadLocationContent();
        return false;
    });

    let aevumHospital = document.getElementById("aevum-hospital");
    aevumHospital.addEventListener("click", function() {
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

    let aevumSummitUniversity = document.getElementById("aevum-summituniversity");
    aevumSummitUniversity.addEventListener("click", function() {
        Player.location = Locations.AevumSummitUniversity;
        Engine.loadLocationContent();
        return false;
    });

    let aevumECorp = document.getElementById("aevum-ecorp");
    aevumECorp.addEventListener("click", function() {
        Player.location = Locations.AevumECorp;
        Engine.loadLocationContent();
        return false;
    });

    let aevumBachmanAndAssociates = document.getElementById("aevum-bachmanandassociates");
    aevumBachmanAndAssociates.addEventListener("click", function() {
        Player.location = Locations.AevumBachmanAndAssociates;
        Engine.loadLocationContent();
        return false;
    });

    let aevumClarkeIncorporated = document.getElementById("aevum-clarkeincorporated");
    aevumClarkeIncorporated.addEventListener("click", function() {
       Player.location = Locations.AevumClarkeIncorporated;
       Engine.loadLocationContent();
       return false;
    });

    let aevumFulcrumTechnologies = document.getElementById("aevum-fulcrumtechnologies");
    aevumFulcrumTechnologies.addEventListener("click", function() {
        Player.location = Locations.AevumFulcrumTechnologies;
        Engine.loadLocationContent();
        return false;
    });

    let aevumAeroCorp = document.getElementById("aevum-aerocorp");
    aevumAeroCorp.addEventListener("click", function() {
        Player.location = Locations.AevumAeroCorp;
        Engine.loadLocationContent();
        return false;
    });

    let aevumGalacticCybersystems = document.getElementById("aevum-galacticcybersystems");
    aevumGalacticCybersystems.addEventListener("click", function() {
        Player.location = Locations.AevumGalacticCybersystems;
        Engine.loadLocationContent();
        return false;
    });

    let aevumWatchdogSecurity = document.getElementById("aevum-watchdogsecurity");
    aevumWatchdogSecurity.addEventListener("click", function() {
        Player.location = Locations.AevumWatchdogSecurity;
        Engine.loadLocationContent();
        return false;
    });

    let aevumRhoConstruction = document.getElementById("aevum-rhoconstruction");
    aevumRhoConstruction.addEventListener("click", function() {
       Player.location = Locations.AevumRhoConstruction;
        Engine.loadLocationContent();
        return false;
    });

    let aevumPolice = document.getElementById("aevum-aevumpolice");
    aevumPolice.addEventListener("click", function() {
        Player.location = Locations.AevumPolice;
        Engine.loadLocationContent();
        return false;
    });

    let aevumNetLinkTechnologies = document.getElementById("aevum-netlinktechnologies");
    aevumNetLinkTechnologies.addEventListener("click", function() {
        Player.location = Locations.AevumNetLinkTechnologies;
        Engine.loadLocationContent();
        return false;
    });

    let aevumCrushFitnessGym = document.getElementById("aevum-crushfitnessgym");
    aevumCrushFitnessGym.addEventListener("click", function() {
        Player.location = Locations.AevumCrushFitnessGym;
        Engine.loadLocationContent();
        return false;
    });

    let aevumSnapFitnessGym = document.getElementById("aevum-snapfitnessgym");
    aevumSnapFitnessGym.addEventListener("click", function() {
        Player.location = Locations.AevumSnapFitnessGym;
        Engine.loadLocationContent();
        return false;
    });

    let aevumSlums = document.getElementById("aevum-slums");
    aevumSlums.addEventListener("click", function() {
        Player.location = Locations.AevumSlums;
        Engine.loadLocationContent();
        return false;
    });

	let chongqingTravelAgency = document.getElementById("chongqing-travelagency");
	chongqingTravelAgency.addEventListener("click", function() {
		Player.location = Locations.ChongqingTravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let chongqingHospital = document.getElementById("chongqing-hospital");
    chongqingHospital.addEventListener("click", function() {
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

	let chongqingKuaiGongInternational = document.getElementById("chongqing-kuaigonginternational");
	chongqingKuaiGongInternational.addEventListener("click", function() {
		Player.location = Locations.ChongqingKuaiGongInternational;
		Engine.loadLocationContent();
        return false;
	});

	let chongqingSolarisSpaceSystems = document.getElementById("chongqing-solarisspacesystems");
	chongqingSolarisSpaceSystems.addEventListener("click", function() {
		Player.location = Locations.ChongqingSolarisSpaceSystems;
		Engine.loadLocationContent();
        return false;
	});

    let chongqingSlums = document.getElementById("chongqing-slums");
    chongqingSlums.addEventListener("click", function() {
        Player.location = Locations.ChongqingSlums;
        Engine.loadLocationContent();
        return false;
    });

	let sector12TravelAgency = document.getElementById("sector12-travelagency");
	sector12TravelAgency.addEventListener("click", function() {
		Player.location = Locations.Sector12TravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let sector12Hospital = document.getElementById("sector12-hospital");
    sector12Hospital.addEventListener("click", function() {
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

    let sector12RothmanUniversity = document.getElementById("sector12-rothmanuniversity");
    sector12RothmanUniversity.addEventListener("click", function() {
        Player.location = Locations.Sector12RothmanUniversity;
        Engine.loadLocationContent();
        return false;
    });

	let sector12MegaCorp = document.getElementById("sector12-megacorp");
	sector12MegaCorp.addEventListener("click", function() {
		Player.location = Locations.Sector12MegaCorp;
		Engine.loadLocationContent();
        return false;
	});

	let sector12BladeIndustries = document.getElementById("sector12-bladeindustries");
	sector12BladeIndustries.addEventListener("click", function() {
		Player.location = Locations.Sector12BladeIndustries;
		Engine.loadLocationContent();
        return false;
	});

	let sector12FourSigma = document.getElementById("sector12-foursigma");
	sector12FourSigma.addEventListener("click", function() {
		Player.location = Locations.Sector12FourSigma;
		Engine.loadLocationContent();
        return false;
	});

	let sector12IcarusMicrosystems = document.getElementById("sector12-icarusmicrosystems");
	sector12IcarusMicrosystems.addEventListener("click", function() {
		Player.location = Locations.Sector12IcarusMicrosystems;
		Engine.loadLocationContent();
        return false;
	});

	let sector12UniversalEnergy = document.getElementById("sector12-universalenergy");
	sector12UniversalEnergy.addEventListener("click", function() {
		Player.location = Locations.Sector12UniversalEnergy;
		Engine.loadLocationContent();
        return false;
	});

	let sector12DeltaOne = document.getElementById("sector12-deltaone");
	sector12DeltaOne.addEventListener("click", function() {
		Player.location = Locations.Sector12DeltaOne;
		Engine.loadLocationContent();
        return false;
	});

	let sector12CIA = document.getElementById("sector12-cia");
	sector12CIA.addEventListener("click", function() {
		Player.location = Locations.Sector12CIA;
		Engine.loadLocationContent();
        return false;
	});

	let sector12NSA = document.getElementById("sector12-nsa");
	sector12NSA.addEventListener("click", function() {
		Player.location = Locations.Sector12NSA;
		Engine.loadLocationContent();
        return false;
	});

	let sector12AlphaEnterprises = document.getElementById("sector12-alphaenterprises");
	sector12AlphaEnterprises.addEventListener("click", function() {
		Player.location = Locations.Sector12AlphaEnterprises;
		Engine.loadLocationContent();
        return false;
	});

	let sector12CarmichaelSecurity = document.getElementById("sector12-carmichaelsecurity");
	sector12CarmichaelSecurity.addEventListener("click", function() {
		Player.location = Locations.Sector12CarmichaelSecurity;
		Engine.loadLocationContent();
        return false;
	});

	let sector12FoodNStuff = document.getElementById("sector12-foodnstuff");
	sector12FoodNStuff.addEventListener("click", function() {
		Player.location = Locations.Sector12FoodNStuff;
		Engine.loadLocationContent();
        return false;
	});

	let sector12JoesGuns = document.getElementById("sector12-joesguns");
	sector12JoesGuns.addEventListener("click", function() {
		Player.location = Locations.Sector12JoesGuns;
		Engine.loadLocationContent();
        return false;
	});

	let sector12IronGym = document.getElementById("sector12-irongym");
	sector12IronGym.addEventListener("click", function() {
		Player.location = Locations.Sector12IronGym;
		Engine.loadLocationContent();
        return false;
	});

	let sector12PowerhouseGym = document.getElementById("sector12-powerhousegym");
	sector12PowerhouseGym.addEventListener("click", function() {
		Player.location = Locations.Sector12PowerhouseGym;
		Engine.loadLocationContent();
        return false;
	});

    let sector12Slums = document.getElementById("sector12-slums");
    sector12Slums.addEventListener("click", function() {
        Player.location = Locations.Sector12Slums;
        Engine.loadLocationContent();
        return false;
    });

    let sector12CityHall = document.getElementById("sector12-cityhall");
    sector12CityHall.addEventListener("click", function() {
        Player.location = Locations.Sector12CityHall;
        Engine.loadLocationContent();
        return false;
    });

	let newTokyoTravelAgency = document.getElementById("newtokyo-travelagency");
	newTokyoTravelAgency.addEventListener("click", function() {
		Player.location = Locations.NewTokyoTravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let newTokyoHospital = document.getElementById("newtokyo-hospital");
    newTokyoHospital.addEventListener("click", function() {
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

	let newTokyoDefComm = document.getElementById("newtokyo-defcomm");
	newTokyoDefComm.addEventListener("click", function() {
		Player.location = Locations.NewTokyoDefComm;
		Engine.loadLocationContent();
        return false;
	});

	let newTokyoVitaLife = document.getElementById("newtokyo-vitalife");
	newTokyoVitaLife.addEventListener("click", function() {
		Player.location = Locations.NewTokyoVitaLife;
		Engine.loadLocationContent();
        return false;
	});

	let newTokyoGlobalPharmaceuticals = document.getElementById("newtokyo-globalpharmaceuticals");
	newTokyoGlobalPharmaceuticals.addEventListener("click", function() {
		Player.location = Locations.NewTokyoGlobalPharmaceuticals;
		Engine.loadLocationContent();
        return false;
	});

	let newTokyoNoodleBar = document.getElementById("newtokyo-noodlebar");
	newTokyoNoodleBar.addEventListener("click", function() {
		Player.location = Locations.NewTokyoNoodleBar;
		Engine.loadLocationContent();
        return false;
	});

    let newTokyoSlums = document.getElementById("newtokyo-slums");
    newTokyoSlums.addEventListener("click", function() {
        Player.location = Locations.NewTokyoSlums;
        Engine.loadLocationContent();
        return false;
    });

	let ishimaTravelAgency = document.getElementById("ishima-travelagency");
	ishimaTravelAgency.addEventListener("click", function() {
		Player.location = Locations.IshimaTravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let ishimaHospital = document.getElementById("ishima-hospital");
    ishimaHospital.addEventListener("click", function() {
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

	let ishimaStormTechnologies = document.getElementById("ishima-stormtechnologies");
	ishimaStormTechnologies.addEventListener("click", function() {
		Player.location = Locations.IshimaStormTechnologies;
		Engine.loadLocationContent();
        return false;
	});

	let ishimaNovaMedical = document.getElementById("ishima-novamedical");
	ishimaNovaMedical.addEventListener("click", function() {
		Player.location = Locations.IshimaNovaMedical;
		Engine.loadLocationContent();
        return false;
	});

	let ishimaOmegaSoftware = document.getElementById("ishima-omegasoftware");
	ishimaOmegaSoftware.addEventListener("click", function() {
		Player.location = Locations.IshimaOmegaSoftware;
		Engine.loadLocationContent();
        return false;
	});

    let ishimaSlums = document.getElementById("ishima-slums");
    ishimaSlums.addEventListener("click", function() {
        Player.location = Locations.IshimaSlums;
        Engine.loadLocationContent();
        return false;
    });

	let volhavenTravelAgency = document.getElementById("volhaven-travelagency");
	volhavenTravelAgency.addEventListener("click", function() {
		Player.location = Locations.VolhavenTravelAgency;
		Engine.loadLocationContent();
        return false;
	});

    let volhavenHospital = document.getElementById("volhaven-hospital");
    volhavenHospital.addEventListener("click", function() {
        Player.location = Locations.Hospital;
        Engine.loadLocationContent();
        return false;
    });

    let volhavenZBInstituteOfTechnology = document.getElementById("volhaven-zbinstituteoftechnology");
    volhavenZBInstituteOfTechnology.addEventListener("click", function() {
        Player.location = Locations.VolhavenZBInstituteOfTechnology;
        Engine.loadLocationContent();
        return false;
    });

	let volhavenOmniTekIncorporated = document.getElementById("volhaven-omnitekincorporated");
	volhavenOmniTekIncorporated.addEventListener("click", function() {
		Player.location = Locations.VolhavenOmniTekIncorporated;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenNWO = document.getElementById("volhaven-nwo");
	volhavenNWO.addEventListener("click", function() {
		Player.location = Locations.VolhavenNWO;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenHeliosLabs = document.getElementById("volhaven-helioslabs");
	volhavenHeliosLabs.addEventListener("click", function() {
		Player.location = Locations.VolhavenHeliosLabs;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenOmniaCybersystems = document.getElementById("volhaven-omniacybersystems");
	volhavenOmniaCybersystems.addEventListener("click", function() {
		Player.location = Locations.VolhavenOmniaCybersystems;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenLexoCorp = document.getElementById("volhaven-lexocorp");
	volhavenLexoCorp.addEventListener("click", function() {
		Player.location = Locations.VolhavenLexoCorp;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenSysCoreSecurities = document.getElementById("volhaven-syscoresecurities");
	volhavenSysCoreSecurities.addEventListener("click", function() {
		Player.location = Locations.VolhavenSysCoreSecurities;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenCompuTek = document.getElementById("volhaven-computek");
	volhavenCompuTek.addEventListener("click", function() {
		Player.location = Locations.VolhavenCompuTek;
		Engine.loadLocationContent();
        return false;
	});

	let volhavenMilleniumFitnessGym = document.getElementById("volhaven-milleniumfitnessgym");
	volhavenMilleniumFitnessGym.addEventListener("click", function() {
		Player.location = Locations.VolhavenMilleniumFitnessGym;
		Engine.loadLocationContent();
        return false;
	});

    let volhavenSlums = document.getElementById("volhaven-slums");
    volhavenSlums.addEventListener("click", function() {
        Player.location = Locations.VolhavenSlums;
        Engine.loadLocationContent();
        return false;
    });

    //Buttons to interact at a location (apply for job/promotion, train, purchase, etc.)
    var softwareJob             = document.getElementById("location-software-job");
    var softwareConsultantJob   = document.getElementById("location-software-consultant-job")
    var itJob                   = document.getElementById("location-it-job");
    var securityEngineerJob     = document.getElementById("location-security-engineer-job");
    var networkEngineerJob      = document.getElementById("location-network-engineer-job");
    var businessJob             = document.getElementById("location-business-job");
    var businessConsultantJob   = document.getElementById("location-business-consultant-job");
    var securityJob             = document.getElementById("location-security-job");
    var agentJob                = document.getElementById("location-agent-job");
    var employeeJob             = document.getElementById("location-employee-job");
    var employeePartTimeJob     = document.getElementById("location-parttime-employee-job");
    var waiterJob               = document.getElementById("location-waiter-job");
    var waiterPartTimeJob       = document.getElementById("location-parttime-waiter-job");

    var work                = document.getElementById("location-work");

    var purchase2gb         = document.getElementById("location-purchase-2gb");
    var purchase4gb         = document.getElementById("location-purchase-4gb");
    var purchase8gb         = document.getElementById("location-purchase-8gb");
    var purchase16gb        = document.getElementById("location-purchase-16gb");
    var purchase32gb        = document.getElementById("location-purchase-32gb");
    var purchase64gb        = document.getElementById("location-purchase-64gb");
    var purchase128gb       = document.getElementById("location-purchase-128gb");
    var purchase256gb       = document.getElementById("location-purchase-256gb");
    var purchase512gb       = document.getElementById("location-purchase-512gb");
    var purchase1tb         = document.getElementById("location-purchase-1tb");
    var purchaseTor         = document.getElementById("location-purchase-tor");
    var purchaseHomeRam     = document.getElementById("location-purchase-home-ram");
    var purchaseHomeCores   = document.getElementById("location-purchase-home-cores");

    var travelToAevum       = document.getElementById("location-travel-to-aevum");
    var travelToChongqing   = document.getElementById("location-travel-to-chongqing");
    var travelToSector12    = document.getElementById("location-travel-to-sector12");
    var travelToNewTokyo    = document.getElementById("location-travel-to-newtokyo");
    var travelToIshima      = document.getElementById("location-travel-to-ishima");
    var travelToVolhaven    = document.getElementById("location-travel-to-volhaven");

    var slumsShoplift       = document.getElementById("location-slums-shoplift");
    var slumsRobStore       = document.getElementById("location-slums-rob-store");
    var slumsMug            = document.getElementById("location-slums-mug");
    var slumsLarceny        = document.getElementById("location-slums-larceny");
    var slumsDealDrugs      = document.getElementById("location-slums-deal-drugs");
    var slumsBondForgery    = document.getElementById("location-slums-bond-forgery");
    var slumsTrafficArms    = document.getElementById("location-slums-traffic-arms");
    var slumsHomicide       = document.getElementById("location-slums-homicide");
    var slumsGta            = document.getElementById("location-slums-gta");
    var slumsKidnap         = document.getElementById("location-slums-kidnap");
    var slumsAssassinate    = document.getElementById("location-slums-assassinate");
    var slumsHeist          = document.getElementById("location-slums-heist");

    var cityHallCreateCorporation = document.getElementById("location-cityhall-create-corporation");

    var nsaBladeburner = document.getElementById("location-nsa-bladeburner");

    var hospitalTreatment   = document.getElementById("location-hospital-treatment");

    softwareJob.addEventListener("click", function() {
        Player.applyForSoftwareJob();
        return false;
    });

    softwareConsultantJob.addEventListener("click", function() {
        Player.applyForSoftwareConsultantJob();
        return false;
    });

    itJob.addEventListener("click", function() {
        Player.applyForItJob();
        return false;
    });

    securityEngineerJob.addEventListener("click", function() {
        Player.applyForSecurityEngineerJob();
        return false;
    });

    networkEngineerJob.addEventListener("click", function() {
        Player.applyForNetworkEngineerJob();
        return false;
    });

    businessJob.addEventListener("click", function() {
        Player.applyForBusinessJob();
        return false;
    });

    businessConsultantJob.addEventListener("click", function() {
        Player.applyForBusinessConsultantJob();
        return false;
    });

    securityJob.addEventListener("click", function() {
        Player.applyForSecurityJob();
        return false;
    });

    agentJob.addEventListener("click", function() {
        Player.applyForAgentJob();
        return false;
    });

    employeeJob.addEventListener("click", function() {
        Player.applyForEmployeeJob();
        return false;
    });

    employeePartTimeJob.addEventListener("click", function() {
        Player.applyForPartTimeEmployeeJob();
        return false;
    });

    waiterJob.addEventListener("click", function() {
        Player.applyForWaiterJob();
        return false;
    });

    waiterPartTimeJob.addEventListener("click", function() {
        Player.applyForPartTimeWaiterJob();
        return false;
    });

    purchase2gb.addEventListener("click", function() {
        purchaseServerBoxCreate(2, 2 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase4gb.addEventListener("click", function() {
        purchaseServerBoxCreate(4, 4 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase8gb.addEventListener("click", function() {
        purchaseServerBoxCreate(8, 8 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase16gb.addEventListener("click", function() {
        purchaseServerBoxCreate(16, 16 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase32gb.addEventListener("click", function() {
        purchaseServerBoxCreate(32, 32 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase64gb.addEventListener("click", function() {
        purchaseServerBoxCreate(64, 64 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase128gb.addEventListener("click", function() {
        purchaseServerBoxCreate(128, 128 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase256gb.addEventListener("click", function() {
        purchaseServerBoxCreate(256, 256 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase512gb.addEventListener("click", function() {
        purchaseServerBoxCreate(512, 512 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchase1tb.addEventListener("click", function() {
        purchaseServerBoxCreate(1024, 1024 * CONSTANTS.BaseCostFor1GBOfRamServer);
        return false;
    });

    purchaseTor.addEventListener("click", function() {
        purchaseTorRouter();
        return false;
    });

    purchaseHomeRam.addEventListener("click", function() {
        //Calculate how many times ram has been upgraded (doubled)
        var currentRam = Player.getHomeComputer().maxRam;
        var newRam = currentRam * 2;
        var numUpgrades = Math.log2(currentRam);

        //Calculate cost
        //Have cost increase by some percentage each time RAM has been upgraded
        var cost = currentRam * CONSTANTS.BaseCostFor1GBOfRamHome;
        var mult = Math.pow(1.58, numUpgrades);
        cost = cost * mult;

        var yesBtn = yesNoBoxGetYesButton(), noBtn = yesNoBoxGetNoButton();
        yesBtn.innerHTML = "Purchase"; noBtn.innerHTML = "Cancel";
        yesBtn.addEventListener("click", ()=>{
            purchaseRamForHomeComputer(cost);
            yesNoBoxClose();
        });
        noBtn.addEventListener("click", ()=>{
            yesNoBoxClose();
        });
        yesNoBoxCreate("Would you like to purchase additional RAM for your home computer? <br><br>" +
                       "This will upgrade your RAM from " + currentRam + "GB to " + newRam + "GB. <br><br>" +
                       "This will cost $" + formatNumber(cost, 2));
    });

    purchaseHomeCores.addEventListener("click", function() {
        var currentCores = Player.getHomeComputer().cpuCores;
        if (currentCores >= 8) {return;} //Max of 8 cores

        //Cost of purchasing another cost is found by indexing this array with number of current cores
        var cost = [0,
                    10000000000,                 //1->2 Cores - 10 bn
                    250000000000,               //2->3 Cores - 250 bn
                    5000000000000,              //3->4 Cores - 5 trillion
                    100000000000000,            //4->5 Cores - 100 trillion
                    1000000000000000,           //5->6 Cores - 1 quadrillion
                    20000000000000000,          //6->7 Cores - 20 quadrillion
                    200000000000000000];        //7->8 Cores - 200 quadrillion
        cost = cost[currentCores];
        var yesBtn = yesNoBoxGetYesButton(), noBtn = yesNoBoxGetNoButton();
        yesBtn.innerHTML = "Purchase"; noBtn.innerHTML = "Cancel";
        yesBtn.addEventListener("click", ()=>{
            if (Player.money.lt(cost)) {
                dialogBoxCreate("You do not have enough mone to purchase an additional CPU Core for your home computer!");
            } else {
                Player.loseMoney(cost);
                Player.getHomeComputer().cpuCores++;
                dialogBoxCreate("You purchased an additional CPU Core for your home computer! It now has " +
                                Player.getHomeComputer().cpuCores +  " cores.");
            }
            yesNoBoxClose();
        });
        noBtn.addEventListener("click", ()=>{
            yesNoBoxClose();
        });
        yesNoBoxCreate("Would you like to purchase an additional CPU Core for your home computer? Each CPU Core " +
                       "lets you start with an additional Core Node in Hacking Missions.<br><br>" +
                       "Purchasing an additional core (for a total of " + (Player.getHomeComputer().cpuCores + 1) + ") will " +
                       "cost " + numeral(cost).format('$0.000a'));
    });

    travelToAevum.addEventListener("click", function() {
        travelBoxCreate(Locations.Aevum, 200000);
        return false;
    });

    travelToChongqing.addEventListener("click", function() {
        travelBoxCreate(Locations.Chongqing, 200000);
        return false;
    });

    travelToSector12.addEventListener("click", function() {
        travelBoxCreate(Locations.Sector12, 200000);
        return false;
    });

    travelToNewTokyo.addEventListener("click", function() {
        travelBoxCreate(Locations.NewTokyo, 200000);
        return false;
    });

    travelToIshima.addEventListener("click", function() {
        travelBoxCreate(Locations.Ishima, 200000);
        return false;
    });

    travelToVolhaven.addEventListener("click", function() {
        travelBoxCreate(Locations.Volhaven, 200000);
        return false;
    });

    slumsShoplift.addEventListener("click", function() {
        commitShopliftCrime();
        return false;
    });

    slumsRobStore.addEventListener("click", function() {
        commitRobStoreCrime();
        return false;
    });

    slumsMug.addEventListener("click", function() {
        commitMugCrime();
        return false;
    });

    slumsLarceny.addEventListener("click", function() {
        commitLarcenyCrime();
        return false;
    });

    slumsDealDrugs.addEventListener("click", function() {
        commitDealDrugsCrime();
        return false;
    });

    slumsBondForgery.addEventListener("click", function() {
        commitBondForgeryCrime();
        return false;
    });

    slumsTrafficArms.addEventListener("click", function() {
        commitTraffickArmsCrime();
        return false;
    });

    slumsHomicide.addEventListener("click", function() {
        commitHomicideCrime();
        return false;
    });

    slumsGta.addEventListener("click", function() {
        commitGrandTheftAutoCrime();
        return false;
    });

    slumsKidnap.addEventListener("click", function() {
        commitKidnapCrime();
        return false;
    });

    slumsAssassinate.addEventListener("click", function() {
        commitAssassinationCrime();
        return false;
    });

    slumsHeist.addEventListener("click", function() {
        commitHeistCrime();
        return false;
    });

    cityHallCreateCorporation.addEventListener("click", function() {
        var yesBtn = yesNoTxtInpBoxGetYesButton(),
            noBtn = yesNoTxtInpBoxGetNoButton();
        yesBtn.innerText = "Create Corporation";
        noBtn.innerText = "Cancel";
        yesBtn.addEventListener("click", function() {
            if (Player.money.lt(150e9)) {
                dialogBoxCreate("You don't have enough money to create a corporation! You need $150b");
                return yesNoTxtInpBoxClose();
            }
            Player.loseMoney(150e9);
            var companyName = yesNoTxtInpBoxGetInput();
            if (companyName == null || companyName == "") {
                dialogBoxCreate("Invalid company name!");
                return false;
            }
            Player.corporation = new Corporation({
                name:companyName,
            });
            displayLocationContent();
            dialogBoxCreate("Congratulations! You just started your own corporation. You can visit " +
                            "and manage your company in the City");
            return yesNoTxtInpBoxClose();
        });
        noBtn.addEventListener("click", function() {
            return yesNoTxtInpBoxClose();
        });
        if (Player.corporation instanceof Corporation) {
            return;
        } else {
            yesNoTxtInpBoxCreate("Would you like to start a corporation? This will require $150b " +
                                 "for registration and initial funding.<br><br>If so, please enter " +
                                 "a name for your corporation below:");
        }
    });

    nsaBladeburner.addEventListener("click", function() {
        if (Player.bladeburner && Player.bladeburner instanceof Bladeburner) {
            //Enter Bladeburner division
            Engine.loadBladeburnerContent();
        } else {
            //Apply for Bladeburner division
            if (Player.strength >= 100 && Player.defense >= 100 &&
                Player.dexterity >= 100 && Player.agility >= 100) {
                Player.bladeburner = new Bladeburner({new:true});
                dialogBoxCreate("You have been accepted into the Bladeburner division!");
                displayLocationContent();
            } else {
                dialogBoxCreate("Rejected! Please apply again when you have 100 of each combat stat (str, def, dex, agi)");
            }
        }
    });

    hospitalTreatment.addEventListener("click", function() {
        if (Player.hp < 0) {Player.hp = 0;}
        var price = (Player.max_hp - Player.hp) * CONSTANTS.HospitalCostPerHp;
        Player.loseMoney(price);
        dialogBoxCreate("You were healed to full health! The hospital billed " +
                        "you for $" + formatNumber(price, 2).toString());
        Player.hp = Player.max_hp;
        displayLocationContent();
        return false;
    });
}

function travelToCity(destCityName, cost) {
    if (Player.firstTimeTraveled === false) {
        Player.firstTimeTraveled = true;
        document.getElementById("travel-tab").style.display = "list-item";
        document.getElementById("world-menu-header").click();
        document.getElementById("world-menu-header").click();
    }

    if (Player.money.lt(cost)) {
        dialogBoxCreate("You cannot afford to travel to " + destCityName);
        return;
    }
    Player.loseMoney(cost);

    Player.city = destCityName;
    dialogBoxCreate("You are now in " + destCityName + "!");
    Engine.loadWorldContent();
}

function purchaseTorRouter() {
    if (Player.money.lt(CONSTANTS.TorRouterCost)) {
        dialogBoxCreate("You cannot afford to purchase the Tor router");
        return;
    }
    Player.loseMoney(CONSTANTS.TorRouterCost);

    var darkweb = new Server({
        ip:createRandomIp(), hostname:"darkweb", organizationName:"",
        isConnectedTo:false, adminRights:false, purchasedByPlayer:false, maxRam:1
    });
    AddToAllServers(darkweb);
    SpecialServerIps.addIp("Darkweb Server", darkweb.ip);

    document.getElementById("location-purchase-tor").setAttribute("class", "a-link-button-inactive");

    Player.getHomeComputer().serversOnNetwork.push(darkweb.ip);
    darkweb.serversOnNetwork.push(Player.getHomeComputer().ip);
    dialogBoxCreate("You have purchased a Tor router!<br>You now have access to the dark web from your home computer<br>Use the scan/netstat commands to search for the dark web connection.");
}

function displayUniversityLocationContent(costMult) {
    var studyComputerScienceButton  = document.getElementById("location-study-computer-science");
    var classDataStructuresButton   = document.getElementById("location-data-structures-class");
    var classNetworksButton         = document.getElementById("location-networks-class");
    var classAlgorithmsButton       = document.getElementById("location-algorithms-class");
    var classManagementButton       = document.getElementById("location-management-class");
    var classLeadershipButton       = document.getElementById("location-leadership-class");
    studyComputerScienceButton.style.display = "block";
    classDataStructuresButton.style.display = "block";
    classNetworksButton.style.display = "block";
    classAlgorithmsButton.style.display = "block";
    classManagementButton.style.display = "block";
    classLeadershipButton.style.display = "block";

    //Costs (per second)
    var dataStructuresCost  = CONSTANTS.ClassDataStructuresBaseCost    * costMult;
    var networksCost        = CONSTANTS.ClassNetworksBaseCost          * costMult;
    var algorithmsCost      = CONSTANTS.ClassAlgorithmsBaseCost        * costMult;
    var managementCost      = CONSTANTS.ClassManagementBaseCost        * costMult;
    var leadershipCost      = CONSTANTS.ClassLeadershipBaseCost        * costMult;

    //Update button text to show cost
    classDataStructuresButton.innerHTML = "Take Data Structures course ($"  + dataStructuresCost + " / sec)";
    classNetworksButton.innerHTML       = "Take Networks course ($"         + networksCost       + " / sec)";
    classAlgorithmsButton.innerHTML     = "Take Algorithms course ($"       + algorithmsCost     + " / sec)";
    classManagementButton.innerHTML     = "Take Management course ($"       + managementCost     + " / sec)";
    classLeadershipButton.innerHTML     = "Take Leadership course ($"       + leadershipCost     + " / sec)";
}

function setUniversityLocationButtons(costMult, expMult) {
    var newStudyCS = clearEventListeners("location-study-computer-science");
    newStudyCS.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassStudyComputerScience);
        return false;
    });

    var newClassDataStructures = clearEventListeners("location-data-structures-class");
    newClassDataStructures.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassDataStructures);
        return false;
    });

    var newClassNetworks = clearEventListeners("location-networks-class");
    newClassNetworks.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassNetworks);
        return false;
    });

    var newClassAlgorithms = clearEventListeners("location-algorithms-class");
    newClassAlgorithms.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassAlgorithms);
        return false;
    });

    var newClassManagement = clearEventListeners("location-management-class");
    newClassManagement.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassManagement);
        return false;
    });

    var newClassLeadership = clearEventListeners("location-leadership-class");
    newClassLeadership.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassLeadership);
        return false;
    });
}

function displayGymLocationContent(costMult) {
    var gymStrButton    = document.getElementById("location-gym-train-str");
    var gymDefButton    = document.getElementById("location-gym-train-def");
    var gymDexButton    = document.getElementById("location-gym-train-dex");
    var gymAgiButton    = document.getElementById("location-gym-train-agi");
    gymStrButton.style.display = "block";
    gymDefButton.style.display = "block";
    gymDexButton.style.display = "block";
    gymAgiButton.style.display = "block";

    //Costs (per second)
    var cost = CONSTANTS.ClassGymBaseCost * costMult;

    //Update button text to show cost
    gymStrButton.innerHTML = "Train Strength ($" + cost + " / sec)";
    gymDefButton.innerHTML = "Train Defense ($" + cost + " / sec)";
    gymDexButton.innerHTML = "Train Dexterity ($" + cost + " / sec)";
    gymAgiButton.innerHTML = "Train Agility ($" + cost + " / sec)";
}

function setGymLocationButtons(costMult, expMult) {
    var gymStr = clearEventListeners("location-gym-train-str");
    gymStr.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassGymStrength);
        return false;
    });

    var gymDef = clearEventListeners("location-gym-train-def");
    gymDef.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassGymDefense);
        return false;
    });

    var gymDex = clearEventListeners("location-gym-train-dex");
    gymDex.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassGymDexterity);
        return false;
    });

    var gymAgi = clearEventListeners("location-gym-train-agi");
    gymAgi.addEventListener("click", function() {
        Player.startClass(costMult, expMult, CONSTANTS.ClassGymAgility);
        return false;
    });
}

function setInfiltrateButton(btn, companyName, startLevel, val, maxClearance, difficulty) {
    btn.style.display = "block";
    btn.addEventListener("click", function() {
        Engine.loadInfiltrationContent();
        beginInfiltration(companyName, startLevel, val, maxClearance, difficulty)
        return false;
    });
}

//Finds the next target job for the player at the given company (loc) and
//adds the tooltiptext to the Application button, given by 'button'
function setJobRequirementTooltip(loc, entryPosType, btn) {
    var company = Companies[loc];
    if (company == null) {return;}
    var pos = Player.getNextCompanyPosition(company, entryPosType);
    if (pos == null) {return};
    if (!company.hasPosition(pos)) {return;}
    var reqText = getJobRequirementText(company, pos, true);
    btn.innerHTML += "<span class='tooltiptext'>" + reqText + "</span>";
}

function travelBoxCreate(destCityName, cost) {
    var yesBtn = yesNoBoxGetYesButton(), noBtn = yesNoBoxGetNoButton();
    yesBtn.innerHTML = "Yes";
    noBtn.innerHTML = "No";
    noBtn.addEventListener("click", () => {
        yesNoBoxClose();
        return false;
    });
    yesBtn.addEventListener("click", () => {
        yesNoBoxClose();
        travelToCity(destCityName, cost);
        return false;
    });
    yesNoBoxCreate("Would you like to travel to " + destCityName + "? The trip will cost $" + formatNumber(cost, 2) + ".");
}

function purchaseServerBoxCreate(ram, cost) {
    var yesBtn = yesNoTxtInpBoxGetYesButton();
    var noBtn = yesNoTxtInpBoxGetNoButton();
    yesBtn.innerHTML = "Purchase Server";
    noBtn.innerHTML = "Cancel";
    yesBtn.addEventListener("click", function() {
        purchaseServer(ram, cost);
        yesNoTxtInpBoxClose();
    });
    noBtn.addEventListener("click", function() {
        yesNoTxtInpBoxClose();
    });

    yesNoTxtInpBoxCreate("Would you like to purchase a new server with " + ram +
                         "GB of RAM for $" + formatNumber(cost, 2) + "?<br><br>" +
                         "Please enter the server hostname below:<br>");
}

export {Locations, displayLocationContent, initLocationButtons};
