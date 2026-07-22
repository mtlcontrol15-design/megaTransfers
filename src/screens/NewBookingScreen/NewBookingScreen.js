
import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Modal } from "react-native";

import { useSelector } from "react-redux";
import { WebView } from "react-native-webview";
import { useStripe } from "@stripe/stripe-react-native";
import { useTheme, useNavigation } from "@react-navigation/native";

import { Formik } from "formik";
import getStyles from "./style";
import Icons from "../../assets/icons";
import toastUtils from "../../utils/Toast/toast";
import LoaderModal from "../../utils/loaderModal";
import { EndPoints } from "../../services/EndPoints";
import queryHandler from "../../services/queries/queryHandler";
import JourneyCard from "../../components/JourneyCard/JourneyCard";
import CustomerInfo from "../../components/CustomerInfo/CustomerInfo";
import { validationNewBookingSchema } from "../../utils/validationUtils";
import { mutationHandler } from "../../services/mutations/mutationHandler";
import ReturnJourneyModal from "../../components/ReturnJourneyModal/ReturnJourneyModal";
import VehicleSelection from "../../components/JourneyCard/components/VehicleSelection/VehicleSelection";



const NewBookingScreen = ({ route }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const navigation = useNavigation();

  const mode = route?.params?.mode || "create";
  const booking = route?.params?.booking || null;

  const [bookingMode, setBookingMode] = useState("Transfer");
  const [tripDistance, setTripDistance] = useState(0);
  const [returnTripDistance, setReturnTripDistance] = useState(0);
  const [isReturnJourney, setIsReturnJourney] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [routeLegs, setRouteLegs] = useState([]);
  const [returnRouteLegs, setReturnRouteLegs] = useState([]);
  const [showReturnJourneyModal, setShowReturnJourneyModal] = useState(false);
  const [hourlyWarning, setHourlyWarning] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [distanceText, setDistanceText] = useState("");
  const [durationText, setDurationText] = useState("");
  const [showPaypalWebView, setShowPaypalWebView] = useState(false);
  const [paypalApprovalUrl, setPaypalApprovalUrl] = useState("");
  const [paypalOrderID, setPaypalOrderID] = useState("");
  const paypalResolveRef = useRef(null);

  const [returnDistanceText, setReturnDistanceText] = useState("");
  const [returnDurationText, setReturnDurationText] = useState("");

  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    email: "",
    phone: "",
    fullPhone: ""
  });

  const [journeyData, setJourneyData] = useState({
    pickup: "",
    pickupCoords: null,
    pickupDoorNumber: "",
    oldAddress: "",
    oldAddressCoords: null,

    dropoffs: [""],
    dropoffCoords: [null],
    dropoffDoorNumbers: [""],
    dropoffTerminals: [""],
    dropoffIsAirportList: [false],

    pickupIsAirport: false,
    dropoffIsAirport: false,

    date: "",
    hour: "",
    minute: "",
    notes: "",
    flightNumber: "",
    arrivefrom: "",
    pickmeAfter: "",
    terminal: "",
  });

  // console.log('=====journey data is here', journeyData);


  const [returnJourneyData, setReturnJourneyData] = useState({
    pickup: "",
    pickupCoords: null,
    pickupDoorNumber: "",

    dropoffs: [""],
    dropoffCoords: [null],
    dropoffDoorNumbers: [""],
    dropoffTerminals: [""],
    dropoffIsAirportList: [false],

    pickupIsAirport: false,
    dropoffIsAirport: false,

    date: "",
    hour: "",
    minute: "",
    notes: "",
    flightNumber: "",
    arrivefrom: "",
    pickmeAfter: "",
    terminal: ""
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [vehicleExtras, setVehicleExtras] = useState({});

  const [selectedHourly, setSelectedHourly] = useState(null);
  const [fare, setFare] = useState(0);
  const [returnFare, setReturnFare] = useState(0);

  const { user } = useSelector(state => state?.userReducer)

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const formikRef = useRef();

  // console.log('======user is here',user);
  // console.log('======selected hour is here', selectedHourly);
  // console.log('======selected vehicle is here', selectedVehicle);
  // console.log('=======fare is here', fare);
  // console.log('=======route booking is here', booking);


  const companyId = user?.companyId;

  // console.log('=======companyId is here', companyId);

  const isCorporate = user?.role === "corporate";
  const isSocialProvider = user?.provider === "google" || user?.provider === "apple";

  // console.log('=========isCorporate is here', isCorporate);

  const TABS = ["Transfer", "Hourly"];

  const symbol = "£";

  const { mutate: getDistance } = mutationHandler(
    EndPoints.getDistance,
    null,
    (res) => {

      const meters = res?.distanceValue || res?.totalDistanceValue || 0;

      const km = meters / 1000;
      const miles = km * 0.621371;

      setTripDistance(miles);

      // ✅ convert km → miles text
      setDistanceText(`${miles.toFixed(2)} miles`);

      // ✅ send API duration text directly
      setDurationText(res?.durationText || "");

      setRouteLegs(res?.legs || []);
    },
    (err) => {
      console.log("Distance API error:", err);
    },
    "get"
  );

  const { mutate: getReturnDistance } = mutationHandler(
    EndPoints.getDistance,
    null,
    (res) => {

      const meters = res?.distanceValue || res?.totalDistanceValue || 0;

      const km = meters / 1000;
      const miles = km * 0.621371;

      setReturnTripDistance(miles);

      // ✅ convert km → miles text
      setReturnDistanceText(`${miles.toFixed(2)} miles`);

      // ✅ duration from API
      setReturnDurationText(res?.durationText || "");

      setReturnRouteLegs(res?.legs || []);
    },
    (err) => {
      console.log("Return Distance API error:", err);
    },
    "get"
  );


  const { mutate, isPending } = mutationHandler(
    EndPoints.creatNewBooking,
    null,
    (res) => {
      // console.log("SUCCESS:", res);
    },
    (err) => {
      console.log("ERROR:", err);
    },
    "post"
  );
  const { mutate: updateBookingMutate, isPending: updateBookingPending } = mutationHandler(
    `${EndPoints.updateBooking}/${booking?._id}`,
    null,
    (res) => {
      console.log("SUCCESS:", res);
    },
    (err) => {
      console.log("ERROR:", err);
    },
    "put"
  );

  const { mutate: payMutate, isPending: paymentIsPending } = mutationHandler(
    EndPoints.stripePay,
    null,
    (res) => {
      console.log("payment response:", res);
    },
    (err) => {
      console.log("payment error:", err);
    },
    "post"
  );
  const { mutate: createOrderMutate, isPending: createOrderPending } = mutationHandler(
    EndPoints.createOrder,
    null,
    (res) => {
      console.log("create order response:", res);
    },
    (err) => {
      console.log("create order error:", err);
    },
    "post"
  );
  const { mutate: captureOrderMutate, isPending: captureOrderPending } = mutationHandler(
    EndPoints.captureOrder,
    null,
    (res) => {
      console.log("capture response:", res);
    },
    (err) => {
      console.log("capture error:", err);
    },
    "post"
  );



  const { data, error, status, isFetching, refetch } = queryHandler(EndPoints.getVehicle);
  // console.log('======== vehicle data is here', data);
  const { data: postCodePriceData, error: postCodePriceError, status: postCodePriceStatus, isFetching: postCodePriceIsFetching, refetch: postCodePriceRefetch } = queryHandler(`${EndPoints.pricePostCode}?companyId=${companyId}`);
  // console.log('======== post code price data is here', postCodePriceData);
  const { data: hourlyData, error: hourlyError, status: hourlyStatus, isFetching: hourlyIsFetching, refetch: hourlyRefetch } = queryHandler(`${EndPoints.priceHourly}?companyId=${companyId}`);
  // console.log('======== hourly price data is here', hourlyData);
  const { data: generalData, error: generalError, status: generalStatus, isFetching: generalIsFetching, refetch: generalRefetch } = queryHandler(`${EndPoints.priceGeneral}?companyId=${companyId}`);
  // console.log('======== general price data is here', generalData);
  const { data: fixedData, error: fixedError, status: fixedStatus, isFetching: fixedIsFetching, refetch: fixedRefetch } = queryHandler(`${EndPoints.fixedPrice}?companyId=${companyId}`);
  // console.log('========fixed price data is here', fixedData);
  const { data: paymentMethodsData, error: paymentMethodsError, status: paymentMethodsStatus, isFetching: paymentMethodsIsFetching, refetch: paymentMethodsRefetch } = queryHandler(`${EndPoints.getPaymentMthods}/${companyId}`);
  // console.log('========payment methods data is here', paymentMethodsData);
  const { data: suggestionsData } = queryHandler(
    `${EndPoints.getSuggestions}?companyId=${user?.companyId}&createdBy=${user?._id}`
  );

  // console.log('======== suggestions data is here', suggestionsData);


  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await Promise.all([
        refetch(),
        postCodePriceRefetch(),
        hourlyRefetch(),
        generalRefetch(),
        fixedRefetch()
      ]);

    } catch (error) {
      console.log("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const extractPostcode = (address, postCodePriceData = []) => {
    if (!address) return "";

    const upperAddress = address.toUpperCase();

    const availableCodes = [];

    postCodePriceData?.forEach((item) => {
      if (item?.pickup) availableCodes.push(item.pickup.toUpperCase());
      if (item?.dropoff) availableCodes.push(item.dropoff.toUpperCase());
    });

    const uniqueCodes = [...new Set(availableCodes)].sort(
      (a, b) => b.length - a.length
    );

    const matched = uniqueCodes.find((code) =>
      upperAddress.includes(code)
    );

    return matched || "";
  };


  const enabledPaymentMethods =
    paymentMethodsData?.data?.paymentOptions?.filter(
      item => item?.isEnabled
    ) || [];
  const formatDate = (isoDate) => {
    if (!isoDate) return "";

    const d = new Date(isoDate);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatPhone = (phone) => {
    if (!phone) return "";

    return phone.replace(/^\+44/, "");
  };

  const getCoordinatePair = (coordinates) => ({
    lat: coordinates?.latitude ?? coordinates?.lat ?? null,
    lng: coordinates?.longitude ?? coordinates?.lng ?? null,
  });

  const isAirportLocation = (address = "", terminal = "") => {
    return !!terminal || /airport|terminal/i.test(address || "");
  };

  const getJourneyDropoffRows = (activeJourney = {}) => {
    const rows = [
      {
        address: activeJourney?.dropoff,
        coordinates: activeJourney?.dropoffCoordinates,
        doorNumber: activeJourney?.dropoffDoorNumber0,
        terminal: activeJourney?.dropoff_terminal_0,
      },
      {
        address: activeJourney?.additionalDropoff1,
        coordinates: activeJourney?.additionalDropoff1Coordinates,
        doorNumber: activeJourney?.dropoffDoorNumber1,
        terminal: activeJourney?.dropoff_terminal_1,
      },
      {
        address: activeJourney?.additionalDropoff2,
        coordinates: activeJourney?.additionalDropoff2Coordinates,
        doorNumber: activeJourney?.dropoffDoorNumber2,
        terminal: activeJourney?.dropoff_terminal_2,
      },
      {
        address: activeJourney?.additionalDropoff3,
        coordinates: activeJourney?.additionalDropoff3Coordinates,
        doorNumber: activeJourney?.dropoffDoorNumber3,
        terminal: activeJourney?.dropoff_terminal_3,
      },
      {
        address: activeJourney?.additionalDropoff4,
        coordinates: activeJourney?.additionalDropoff4Coordinates,
        doorNumber: activeJourney?.dropoffDoorNumber4,
        terminal: activeJourney?.dropoff_terminal_4,
      },
    ].filter(row => !!row.address);

    return rows.length ? rows : [{ address: "", coordinates: null, doorNumber: "", terminal: "" }];
  };

  const buildJourneyState = (activeJourney = {}) => {
    const dropoffRows = getJourneyDropoffRows(activeJourney);
    const dropoffIsAirportList = dropoffRows.map(row =>
      isAirportLocation(row.address, row.terminal)
    );

    return {
      pickup: activeJourney?.pickup || "",
      pickupCoords: getCoordinatePair(activeJourney?.pickupCoordinates),
      pickupDoorNumber: activeJourney?.pickupDoorNumber || "",
      dropoffs: dropoffRows.map(row => row.address || ""),
      dropoffCoords: dropoffRows.map(row => getCoordinatePair(row.coordinates)),
      dropoffDoorNumbers: dropoffRows.map(row => row.doorNumber || ""),
      dropoffTerminals: dropoffRows.map(row => row.terminal || ""),
      dropoffIsAirportList,

      pickupIsAirport: isAirportLocation(activeJourney?.pickup),
      dropoffIsAirport: dropoffIsAirportList.some(Boolean),

      date: formatDate(activeJourney?.date) || "",
      hour: activeJourney?.hour || "",
      minute: activeJourney?.minute || "",

      notes: activeJourney?.notes || "",
      flightNumber: activeJourney?.flightNumber || "",
      arrivefrom: activeJourney?.arrivefrom || "",
      pickmeAfter: activeJourney?.pickmeAfter || "",
      terminal: activeJourney?.terminal || "",
    };
  };

  useEffect(() => {
    if ((isCorporate || isSocialProvider) && user?.email) {
      setPassengerDetails(prev => ({
        ...prev,
        email: user.email,
      }));

      formikRef.current?.setFieldValue("email", user.email);
    }
  }, [isCorporate, isSocialProvider, user?.email]);


  useEffect(() => {

    if (mode === "edit" && booking) {

      setPassengerDetails({
        name: booking?.passenger?.name || "",
        email: booking?.passenger?.email || "",
        phone: formatPhone(booking?.passenger?.phone),
        fullPhone: booking?.passenger?.phone || "",
      });

      if (booking?.paymentMethod) {
        setSelectedPaymentMethod(booking.paymentMethod);
      }

      formikRef.current?.setFieldValue(
        "name",
        booking?.passenger?.name || ""
      );

      formikRef.current?.setFieldValue(
        "email",
        booking?.passenger?.email || ""
      );

      formikRef.current?.setFieldValue(
        "phone",
        formatPhone(
          booking?.passenger?.phone
        ) || ""
      );

      const isReturnJourneyBooking = booking?.returnJourneyToggle === true;
      const activeJourney = isReturnJourneyBooking ? booking?.returnJourney : booking?.primaryJourney;
      const mappedJourney = buildJourneyState(activeJourney);

      setJourneyData(mappedJourney);

      if (isReturnJourneyBooking) {
        setIsReturnJourney(true);
        setReturnJourneyData(mappedJourney);
        setReturnFare(booking?.returnJourneyFare || 0);
      } else {
        setFare(booking?.journeyFare || 0);
      }

      setSelectedVehicle(booking?.vehicle || null);

      setVehicleExtras({
        [booking?.vehicle?._id]: {
          passenger: booking?.vehicle?.passenger || 0,
          childSeat: booking?.vehicle?.childSeat || 0,
          babySeat: booking?.vehicle?.babySeat || 0,
          childSeatType: booking?.vehicle?.childSeatType || 0,
          boosterSeat: booking?.vehicle?.boosterSeat || 0,
          handLuggage: booking?.vehicle?.handLuggage || 0,
          checkinLuggage: booking?.vehicle?.checkinLuggage || 0,
        }
      });

      if (booking?.mode === "Hourly") {
        setBookingMode("Hourly");

        if (booking?.hourlyWarning) {
          setHourlyWarning(booking.hourlyWarning);
        }
      }

    }

  }, [booking]);


  useEffect(() => {
    if (mode === "edit" && booking) {

      if (
        booking?.paymentMethod &&
        paymentMethodsData?.data?.paymentOptions
      ) {
        const matchedMethod =
          paymentMethodsData.data.paymentOptions.find(
            item =>
              item.paymentMethod === booking.paymentMethod
          );

        setSelectedPaymentMethod(
          matchedMethod?.customName ||
          booking.paymentMethod
        );
      }

    }
  }, [booking, paymentMethodsData]);

  useEffect(() => {
    if (mode !== "edit" || !booking?.vehicle || !data?.length) return;

    const bookingVehicleName = booking.vehicle.vehicleName
      ?.trim()
      ?.toLowerCase();

    const matchedVehicle = data.find(
      v =>
        v.vehicleName?.trim()?.toLowerCase() === bookingVehicleName
    );

    if (!matchedVehicle) return;

    setSelectedVehicle(matchedVehicle);

    formikRef.current?.setFieldValue("vehicle", matchedVehicle);

    setVehicleExtras({
      [matchedVehicle._id]: {
        passenger: booking?.vehicle?.passenger || 0,
        childSeat: booking?.vehicle?.childSeat || 0,
        babySeat: booking?.vehicle?.babySeat || 0,
        childSeatType: booking?.vehicle?.childSeatType || 0,
        boosterSeat: booking?.vehicle?.boosterSeat || 0,
        handLuggage: booking?.vehicle?.handLuggage || 0,
        checkinLuggage: booking?.vehicle?.checkinLuggage || 0,
      },
    });
  }, [mode, booking, data]);


  useEffect(() => {
    if (
      bookingMode === "Hourly" &&
      mode === "edit" &&
      booking?.mode === "Hourly" &&
      hourlyData &&
      hourlyData.length > 0 &&
      selectedVehicle &&
      !selectedHourly
    ) {
      const matchedHourly = hourlyData.find(option =>
        option.vehicleRates &&
        option.vehicleRates[selectedVehicle?.vehicleName]
      );

      if (matchedHourly) {
        setSelectedHourly(matchedHourly);
      }
    }
  }, [bookingMode, mode, booking?.mode, hourlyData, selectedVehicle]);

  useEffect(() => {
    const origin = journeyData.pickup?.trim();
    const dropoffs = journeyData.dropoffs?.filter(d => d?.trim());

    if (!origin || !dropoffs?.length || !companyId) return;

    const destinations = dropoffs.join("|");

    const timer = setTimeout(() => {
      getDistance({
        __endpoint__: `${EndPoints.getDistance}?origin=${encodeURIComponent(origin)}
      &destinations=${encodeURIComponent(destinations)}
      &companyId=${encodeURIComponent(companyId)}`
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [journeyData.pickup, journeyData.dropoffs, companyId]);

  useEffect(() => {
    const origin = returnJourneyData.pickup?.trim();
    const dropoffs = returnJourneyData.dropoffs?.filter(d => d?.trim());

    if (!origin || !dropoffs?.length || !companyId) return;

    const destinations = dropoffs.join("|");

    const timer = setTimeout(() => {
      getReturnDistance({
        __endpoint__: `${EndPoints.getDistance}?origin=${encodeURIComponent(origin)}
      &destinations=${encodeURIComponent(destinations)}
      &companyId=${encodeURIComponent(companyId)}`
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [returnJourneyData.pickup, returnJourneyData.dropoffs, companyId]);

  const applyGeneralCharges = (baseFare, journeyDataParam = journeyData) => {
    let total = Number(baseFare || 0);

    const vehiclePercent =
      Number(selectedVehicle?.percentageIncrease || 0);

    total += (total * vehiclePercent) / 100;

    const currentExtras = vehicleExtras[selectedVehicle?._id] || {
      passenger: 0,
      childSeat: 0,
      babySeat: 0,
      childSeatType: 0,
      boosterSeat: 0,
      handLuggage: 0,
      checkinLuggage: 0,
    };

    const childSeats =
      Number(currentExtras?.childSeat || 0);

    const childSeatPrice =
      Number(generalData?.childSeatPrice || 0);

    total += childSeats * childSeatPrice;

    if (journeyDataParam?.pickupIsAirport) {
      total += Number(generalData?.pickupAirportPrice || 0);
    }

    if (journeyDataParam?.dropoffIsAirport) {
      total += Number(generalData?.dropoffAirportPrice || 0);
    }

    const extraStops =
      Math.max(
        (journeyDataParam?.dropoffs?.filter((x) => x?.trim())?.length || 1) - 1,
        0
      );

    total +=
      extraStops *
      Number(generalData?.minAdditionalDropOff || 0);

    // tax
    // const tax =
    //   Number(generalData?.invoiceTaxPercent || 0);

    // total += (total * tax) / 100;

    return Number(total.toFixed(2));
  };

  const calculateSlabFare = (distance, slabs = []) => {
    let remainingDistance = Number(distance);
    let totalFare = 0;

    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i];

      const from = Number(slab.from);
      const to = Number(slab.to);
      const slabPrice = Number(slab.price);

      if (remainingDistance <= 0) break;

      const slabRange = to - from;

      if (slabRange <= 0) continue;

      const distanceInThisSlab = Math.min(remainingDistance, slabRange);

      const pricePerMile = slabPrice / slabRange;

      totalFare += distanceInThisSlab * pricePerMile;

      remainingDistance -= distanceInThisSlab;
    }

    return Number(totalFare.toFixed(2));
  };

  const calculateFare = () => {
    let fareCalculated = false;

    if (bookingMode === "Hourly") {
      if (!selectedHourly || !selectedVehicle || tripDistance === 0) {
        setFare(0);
        return;
      }

      const vehicleName = selectedVehicle?.vehicleName;
      const ratePerHour = selectedHourly?.vehicleRates?.[vehicleName];

      if (!ratePerHour) {
        setFare(0);
        return;
      }

      const allowedDistance = Number(selectedHourly.distance || 0);
      const actualDistance = Number(tripDistance || 0);

      let hourlyWarning = "";

      if (actualDistance > allowedDistance) {
        const allowedDistance = Number(selectedHourly.distance || 0);
        const allowedHours = Number(selectedHourly.hours || 0);
        const actualDistance = Number(tripDistance || 0);

        let hourlyWarning = "";

        if (actualDistance > allowedDistance) {
          hourlyWarning = `You've selected ${allowedDistance} miles for ${allowedHours} hours, but your trip is ${actualDistance.toFixed(2)} miles. Prices are shown for your selected package. Extra charges may apply.`;

          setFare(Number(ratePerHour));
          setHourlyWarning(hourlyWarning);

          return;
        }

        // Alert.alert("Warning", hourlyWarning);

        setFare(Number(ratePerHour));

        setHourlyWarning(hourlyWarning);

        return;
      }

      setHourlyWarning("");
      setFare(Number(ratePerHour));

      setFare(Number(ratePerHour));
      return;
    }

    if (!journeyData.pickup || !journeyData.dropoffs?.length) {
      setFare(0);
      return;
    }

    const pickupAddress = journeyData.pickup?.toLowerCase() || "";
    const dropoffAddress =
      journeyData.dropoffs.find(d => d?.trim())?.toLowerCase() || "";

    const pickupPostcode = extractPostcode(journeyData.pickup, postCodePriceData);
    const dropoffPostcode = extractPostcode(
      journeyData.dropoffs.find(d => d?.trim()),
      postCodePriceData
    );

    if (pickupPostcode && dropoffPostcode) {
      const matchedRoute = postCodePriceData?.find(item =>
        (item.pickup === pickupPostcode && item.dropoff === dropoffPostcode) ||
        (item.pickup === dropoffPostcode && item.dropoff === pickupPostcode)
      );

      if (matchedRoute) {
        const finalFare = applyGeneralCharges(matchedRoute.price);
        setFare(finalFare);
        fareCalculated = true;

        // console.log("POSTCODE FARE:", finalFare);
      }
    }

    if (!fareCalculated) {
      const matchedFixed = fixedData?.find(item => {
        const pickupMatch = pickupAddress.includes(item.pickup?.toLowerCase());
        const dropoffMatch = dropoffAddress.includes(item.dropoff?.toLowerCase());

        const reversePickupMatch = pickupAddress.includes(item.dropoff?.toLowerCase());
        const reverseDropoffMatch = dropoffAddress.includes(item.pickup?.toLowerCase());

        return (
          (pickupMatch && dropoffMatch) ||
          (reversePickupMatch && reverseDropoffMatch)
        );
      });

      if (matchedFixed) {
        const finalFare = applyGeneralCharges(matchedFixed.price);
        setFare(finalFare);
        fareCalculated = true;

        // console.log("FIXED FARE:", finalFare);
      }
    }

    let totalMiles = routeLegs?.length > 0
      ? routeLegs.reduce((sum, leg) => {
        const km = leg.distanceValue / 1000;
        return sum + (km * 0.621371);
      }, 0)
      : tripDistance;

    // console.log("TOTAL MILES:", totalMiles);
    // console.log("SLABS:", selectedVehicle?.slabs);

    const baseFare = calculateSlabFare(
      totalMiles,
      selectedVehicle?.slabs || []
    );

    // console.log("BASE FARE:", baseFare);

    if (!fareCalculated && baseFare > 0) {
      const finalFare = applyGeneralCharges(baseFare);
      setFare(finalFare);
      fareCalculated = true;

      // console.log("FINAL FARE (WITH CHARGES):", finalFare);
    }

    if (!fareCalculated) {
      // console.log("NO FARE CALCULATED → 0");
      setFare(0);
    }
  };

  const calculateReturnFare = () => {
    let fareCalculated = false;

    if (bookingMode === "Hourly") {
      if (!selectedHourly || !selectedVehicle) {
        setReturnFare(0);
        return;
      }

      const vehicleName = selectedVehicle?.vehicleName;
      const ratePerHour = selectedHourly?.vehicleRates?.[vehicleName];

      if (ratePerHour) {
        setReturnFare(Number(ratePerHour));
        return;
      }

      setReturnFare(0);
      return;
    }

    if (!returnJourneyData.pickup || !returnJourneyData.dropoffs?.length) {
      setReturnFare(0);
      return;
    }

    const pickupAddress = returnJourneyData.pickup?.toLowerCase() || "";
    const dropoffAddress =
      returnJourneyData.dropoffs.find(d => d?.trim())?.toLowerCase() || "";

    const pickupPostcode = extractPostcode(returnJourneyData.pickup, postCodePriceData);
    const dropoffPostcode = extractPostcode(
      returnJourneyData.dropoffs.find(d => d?.trim()),
      postCodePriceData
    );

    if (pickupPostcode && dropoffPostcode) {
      const matchedRoute = postCodePriceData?.find(item => {
        const isForward =
          item.pickup === pickupPostcode &&
          item.dropoff === dropoffPostcode;

        const isReverse =
          item.pickup === dropoffPostcode &&
          item.dropoff === pickupPostcode;

        return (isForward || isReverse) && item.direction === "both ways";
      });

      if (matchedRoute) {
        const finalFare = applyGeneralCharges(
          matchedRoute.price,
          returnJourneyData
        );

        setReturnFare(finalFare);
        fareCalculated = true;

        // console.log("RETURN POSTCODE FARE:", finalFare);
      }
    }

    if (!fareCalculated) {
      const matchedFixed = fixedData?.find(item => {
        const pickupMatch = pickupAddress.includes(item.pickup?.toLowerCase());
        const dropoffMatch = dropoffAddress.includes(item.dropoff?.toLowerCase());

        const reversePickupMatch = pickupAddress.includes(item.dropoff?.toLowerCase());
        const reverseDropoffMatch = dropoffAddress.includes(item.pickup?.toLowerCase());

        return (
          (pickupMatch && dropoffMatch) ||
          (reversePickupMatch && reverseDropoffMatch)
        );
      });

      if (matchedFixed) {
        const finalFare = applyGeneralCharges(
          matchedFixed.price,
          returnJourneyData
        );

        setReturnFare(finalFare);
        fareCalculated = true;
      }
    }

    let totalMiles = returnRouteLegs?.length > 0
      ? returnRouteLegs.reduce((sum, leg) => {
        const km = leg.distanceValue / 1000;
        return sum + (km * 0.621371);
      }, 0)
      : returnTripDistance;

    // console.log("RETURN TOTAL MILES:", totalMiles);
    // console.log("RETURN SLABS:", selectedVehicle?.slabs);

    const baseFare = calculateSlabFare(
      totalMiles,
      selectedVehicle?.slabs || []
    );

    // console.log("RETURN BASE FARE:", baseFare);

    if (!fareCalculated && baseFare > 0) {
      const finalFare = applyGeneralCharges(
        baseFare,
        returnJourneyData
      );

      setReturnFare(finalFare);
      fareCalculated = true;

      // console.log("RETURN FINAL FARE:", finalFare);
    }

    if (!fareCalculated) {
      setReturnFare(0);
    }
  };

  const mapDropoffsToPrimaryJourney = (journeyData, fare, distanceText = "",
    durationText = ""
  ) => {
    const coords = journeyData.dropoffCoords || [];
    const doorNumbers = journeyData.dropoffDoorNumbers || [];
    const terminals = journeyData.dropoffTerminals || [];
    const getLat = (coordinate) => coordinate?.lat ?? coordinate?.latitude ?? null;
    const getLng = (coordinate) => coordinate?.lng ?? coordinate?.longitude ?? null;

    return {
      pickup: journeyData.pickup,
      dropoff: journeyData.dropoffs[0] || null,

      additionalDropoff1: journeyData.dropoffs[1] || null,
      additionalDropoff2: journeyData.dropoffs[2] || null,
      additionalDropoff3: journeyData.dropoffs[3] || null,
      additionalDropoff4: journeyData.dropoffs[4] || null,

      pickupCoordinates: {
        latitude: getLat(journeyData.pickupCoords),
        longitude: getLng(journeyData.pickupCoords),
      },
      pickupDoorNumber: journeyData.pickupDoorNumber || "",

      dropoffCoordinates: {
        latitude: getLat(coords[0]),
        longitude: getLng(coords[0]),
      },
      dropoffDoorNumber0: doorNumbers[0] || "",
      dropoff_terminal_0: terminals[0] || "",

      additionalDropoff1Coordinates: {
        latitude: getLat(coords[1]),
        longitude: getLng(coords[1]),
      },
      dropoffDoorNumber1: doorNumbers[1] || "",
      dropoff_terminal_1: terminals[1] || "",

      additionalDropoff2Coordinates: {
        latitude: getLat(coords[2]),
        longitude: getLng(coords[2]),
      },
      dropoffDoorNumber2: doorNumbers[2] || "",
      dropoff_terminal_2: terminals[2] || "",

      additionalDropoff3Coordinates: {
        latitude: getLat(coords[3]),
        longitude: getLng(coords[3]),
      },
      dropoffDoorNumber3: doorNumbers[3] || "",
      dropoff_terminal_3: terminals[3] || "",

      additionalDropoff4Coordinates: {
        latitude: getLat(coords[4]),
        longitude: getLng(coords[4]),
      },
      dropoffDoorNumber4: doorNumbers[4] || "",
      dropoff_terminal_4: terminals[4] || "",

      distanceText,
      durationText,


      date: journeyData.date,
      hour: String(journeyData.hour).padStart(2, "0"),
      minute: String(journeyData.minute).padStart(2, "0"),

      notes: journeyData.notes || "",
      flightNumber: journeyData.flightNumber || "",
      arrivefrom: journeyData.arrivefrom || "",
      pickmeAfter: journeyData.pickmeAfter || "",
      terminal: journeyData.terminal || "",

      fare: Number(fare) || 0
    };
  };

  const handleCloseReturnModal = () => {
    setShowReturnJourneyModal(false);
  };

  const totalFare = isReturnJourney
    ? Number(fare || 0) + Number(returnFare || 0)
    : Number(fare || 0);

  const openStripePaymentSheet = async () => {
    try {

      const response = await new Promise((resolve, reject) => {
        payMutate(
          {
            amount: totalFare,
            currency: "gbp",
            customerEmail: user?.email,
            saveCard: true,
            metadata: {
              companyId: user?.companyId,
            },
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });

      console.log("PAYMENT API RESPONSE:", response);

      const clientSecret = response?.clientSecret;
      const customerId = response?.customerId;
      const ephemeralKey = response?.ephemeralKey;

      if (!clientSecret) {
        toastUtils.showError("Payment Error", "Client secret not found");
        return false;
      }

      // INIT PAYMENT SHEET
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: "Booking App",
        paymentIntentClientSecret: clientSecret,

        // Card Saving
        ...(customerId && ephemeralKey
          ? {
            customerId,
            customerEphemeralKeySecret: ephemeralKey,
            savePaymentMethod: true,
          }
          : {}),

        allowsDelayedPaymentMethods: true,
      });

      if (initError) {
        console.log("INIT ERROR:", initError);
        toastUtils.showError("Stripe Error", initError.message);
        return false;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        console.log("PAYMENT SHEET ERROR:", paymentError);
        toastUtils.showError("Payment Failed", paymentError.message);
        return false;
      }

      toastUtils.showSuccess("Payment Success", "Payment completed successfully");
      return true;

    } catch (err) {
      console.log("STRIPE ERROR:", err);
      toastUtils.showError("Payment Failed", err?.message || "Something went wrong");
      return false;
    }
  };

  const openPaypalPayment = async () => {
    try {
      const createOrderResponse = await new Promise((resolve, reject) => {
        createOrderMutate(
          {
            amount: Number(totalFare || 0),
            companyId: user?.companyId,
            passengerEmail: passengerDetails?.email || user?.email,
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        );
      });

      console.log("PAYPAL CREATE ORDER RESPONSE:", createOrderResponse);

      const orderID =
        createOrderResponse?.orderID ||
        createOrderResponse?.orderId ||
        createOrderResponse?.id;

      const approvalUrl =
        createOrderResponse?.approveUrl ||
        createOrderResponse?.approvalUrl ||
        createOrderResponse?.approval_url ||
        createOrderResponse?.links?.find(item => item?.rel === "approve")?.href;

      if (!orderID || !approvalUrl) {
        toastUtils.showError(
          "PayPal Error",
          "PayPal order or approval link not found"
        );
        return false;
      }

      setPaypalOrderID(orderID);
      setPaypalApprovalUrl(approvalUrl);
      setShowPaypalWebView(true);

      return await new Promise(resolve => {
        paypalResolveRef.current = resolve;
      });
    } catch (error) {
      console.log("PAYPAL CREATE ORDER ERROR:", error);

      toastUtils.showError(
        "PayPal Failed",
        error?.message || "Something went wrong"
      );

      return false;
    }
  };

  const handlePaypalNavigation = async (navState) => {
    const url = navState?.url || "";

    console.log("PAYPAL WEBVIEW URL:", url);

    if (url.includes("paypal-success")) {
      try {
        setShowPaypalWebView(false);

        const captureResponse = await new Promise((resolve, reject) => {
          captureOrderMutate(
            {
              orderID: paypalOrderID,
              companyId: user?.companyId,
              passengerEmail: passengerDetails?.email || user?.email,
            },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });

        console.log("PAYPAL CAPTURE RESPONSE:", captureResponse);

        const isPaid =
          captureResponse?.status === "COMPLETED" ||
          captureResponse?.capture?.status === "COMPLETED" ||
          captureResponse?.data?.status === "COMPLETED" ||
          captureResponse?.success === true;

        if (!isPaid) {
          toastUtils.showError(
            "PayPal Failed",
            "Payment was not completed"
          );

          paypalResolveRef.current?.(false);
          paypalResolveRef.current = null;
          return;
        }

        toastUtils.showSuccess(
          "PayPal Success",
          "Payment completed successfully"
        );

        paypalResolveRef.current?.(true);
        paypalResolveRef.current = null;
        return;
      } catch (error) {
        console.log("PAYPAL CAPTURE ERROR:", error);

        toastUtils.showError(
          "PayPal Failed",
          error?.message || "Could not capture PayPal payment"
        );

        paypalResolveRef.current?.(false);
        paypalResolveRef.current = null;
        return;
      }
    }

    if (url.includes("paypal-cancel")) {
      setShowPaypalWebView(false);

      toastUtils.showError(
        "PayPal Cancelled",
        "Payment was cancelled"
      );

      paypalResolveRef.current?.(false);
      paypalResolveRef.current = null;
    }
  };


  useEffect(() => {
    calculateFare();
  }, [
    bookingMode,
    journeyData.pickup,
    journeyData.dropoffs,
    selectedVehicle,
    vehicleExtras,
    postCodePriceData,
    fixedData,
    selectedHourly,
    hourlyData,
    tripDistance
  ]);

  useEffect(() => {
    calculateReturnFare();
  }, [
    bookingMode,
    returnJourneyData.pickup,
    returnJourneyData.dropoffs,
    selectedVehicle,
    vehicleExtras,
    postCodePriceData,
    fixedData,
    selectedHourly,
    hourlyData,
    isReturnJourney,
    returnTripDistance
  ]);

  return (
    <Formik
      innerRef={formikRef}
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize={true}
      initialValues={{
        name: passengerDetails.name,
        email: passengerDetails.email,
        phone: passengerDetails.phone,
        pickup: journeyData.pickup,
        dropoff: journeyData.dropoffs?.[0] || "",
        date: journeyData.date,
        hour: journeyData.hour,
        minute: journeyData.minute,
        vehicle: selectedVehicle,
      }}

      validationSchema={validationNewBookingSchema}

      onSubmit={async () => {

        const currentVehicleExtras =
          vehicleExtras[selectedVehicle?._id] || {};

        if (
          !currentVehicleExtras?.passenger ||
          currentVehicleExtras?.passenger <= 0
        ) {

          toastUtils.showError(
            "Passengers Required",
            "Please select at least 1 passenger"
          );

          return;
        }

        if (bookingMode === "Hourly" && !selectedHourly?._id) {
          toastUtils.showError(
            "Hourly Package Required",
            "Please select an hourly package"
          );

          return;
        }

        if (!selectedPaymentMethod) {

          toastUtils.showError(
            "Payment Method Required",
            "Please select a payment method"
          );

          return;
        }
        // const currentVehicleExtras = vehicleExtras[selectedVehicle?._id] || {
        //   passenger: 0,
        //   childSeat: 0,
        //   babySeat: 0,
        //   childSeatType: 0,
        //   boosterSeat: 0,
        //   handLuggage: 0,
        //   checkinLuggage: 0,
        // };

        const basePayload = {
          companyId: user?.companyId,
          mode: bookingMode,
          hourlyWarning: hourlyWarning || "",
          ...(bookingMode === "Hourly" && selectedHourly?._id && { hourlyOption: selectedHourly._id }),

          vehicle: {
            vehicleName: selectedVehicle?.vehicleName,
            passenger: currentVehicleExtras?.passenger || 0,
            childSeat: currentVehicleExtras?.childSeat || 0,
            babySeat: currentVehicleExtras?.babySeat || 0,
            childSeatType: currentVehicleExtras?.childSeatType || 0,
            boosterSeat: currentVehicleExtras?.boosterSeat || 0,
            handLuggage: currentVehicleExtras?.handLuggage || 0,
            checkinLuggage: currentVehicleExtras?.checkinLuggage || 0,
          },

          passenger: {
            name: passengerDetails?.name,
            email: passengerDetails?.email,
            phone: passengerDetails?.fullPhone,
          },

          paymentMethod:
            selectedPaymentMethod === "Pay Via Debit/Credit Card"
              ? "stripe"
              : selectedPaymentMethod === "PayPal" ||
                selectedPaymentMethod === "Pay Via PayPal"
                ? "paypal"
                : selectedPaymentMethod
        };

        try {

          if (
            selectedPaymentMethod ===
            "Pay Via Debit/Credit Card"
          ) {

            const paymentSuccess =
              await openStripePaymentSheet();

            if (!paymentSuccess) {
              return;
            }
          }

          if (
            selectedPaymentMethod === "PayPal" ||
            selectedPaymentMethod === "Pay Via PayPal"
          ) {
            const paymentSuccess = await openPaypalPayment();

            if (!paymentSuccess) {
              return;
            }
          }
          const isEditingReturnJourney = mode === "edit" && booking?.returnJourneyToggle === true;

          if (mode === "edit" && isEditingReturnJourney) {
            const returnBody = {
              ...basePayload,
              returnJourneyToggle: true,
              returnJourney: mapDropoffsToPrimaryJourney(
                returnJourneyData,
                returnFare,
                returnDistanceText,
                returnDurationText

              ),
              returnJourneyFare: Number(returnFare) || 0,
              journeyFare: 0,
            };

            console.log("Return Journey Edit Payload:", returnBody);

            await new Promise((resolve, reject) => {
              updateBookingMutate(
                {
                  bookingData: returnBody,
                },
                {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            });
          } else if (mode === "edit" && !isEditingReturnJourney) {
            const primaryBody = {
              ...basePayload,
              returnJourneyToggle: false,
              primaryJourney: mapDropoffsToPrimaryJourney(journeyData, fare, distanceText, durationText),
              journeyFare: Number(fare) || 0,
            };

            console.log("Primary Journey Edit Payload:", primaryBody);

            await new Promise((resolve, reject) => {
              updateBookingMutate(
                {
                  bookingData: primaryBody,
                },
                {
                  onSuccess: resolve,
                  onError: reject,
                }
              );
            });

            if (isReturnJourney) {
              const returnBody = {
                ...basePayload,
                returnJourneyToggle: true,
                returnJourney: mapDropoffsToPrimaryJourney(
                  returnJourneyData,
                  returnFare,
                  returnDistanceText,
                  returnDurationText
                ),
                returnJourneyFare: Number(returnFare) || 0,
                journeyFare: 0,
              };

              console.log("Return Journey Create From Edit Payload:", returnBody);

              await new Promise((resolve, reject) => {
                mutate(returnBody, {
                  onSuccess: resolve,
                  onError: reject,
                });
              });
            }
          } else {
            const primaryBody = {
              ...basePayload,
              returnJourneyToggle: false,
              primaryJourney: mapDropoffsToPrimaryJourney(journeyData, fare, distanceText, durationText),
              journeyFare: Number(fare) || 0,
            };

            console.log("Primary Payload:", primaryBody);

            await new Promise((resolve, reject) => {
              mutate(primaryBody, {
                onSuccess: resolve,
                onError: reject,
              });
            });

            // If return journey is enabled, create return journey as well
            if (isReturnJourney) {
              const returnBody = {
                ...basePayload,
                returnJourneyToggle: true,
                returnJourney: mapDropoffsToPrimaryJourney(
                  returnJourneyData,
                  returnFare,
                  returnDistanceText,
                  returnDurationText
                ),
                returnJourneyFare: Number(returnFare) || 0,
                journeyFare: 0,
              };

              console.log("Return Payload:", returnBody);

              await new Promise((resolve, reject) => {
                mutate(returnBody, {
                  onSuccess: resolve,
                  onError: reject,
                });
              });
            }
          }

          toastUtils.showSuccess(
            mode === "edit" ? "Booking Updated" : "Booking Created",
            isReturnJourney || isEditingReturnJourney
              ? "Journey processed successfully"
              : "Booking processed successfully"
          );

          navigation.goBack();
        } catch (error) {
          toastUtils.showError(
            "Booking Failed",
            error.message || "Something went wrong"
          );
        }
      }}
    >
      {({ handleSubmit, errors, values, touched, setFieldValue, setFieldTouched, validateForm
      }) => (

        <View style={{ flex: 1, backgroundColor: colors.white }}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.goBack()}
            >
              <Icons.ArrowLeft size={26} color={colors.white} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {mode === "edit" ? "Edit Booking" : "New Booking"}
            </Text>

            <TouchableOpacity activeOpacity={0.7} onPress={handleRefresh}>
              <Icons.RefreshCcw size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.midContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 30 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            >
              <View style={styles.tabsContainer}>
                {TABS.map((tab) => {
                  const isSelected = bookingMode === tab;

                  return (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.tabButton, isSelected && styles.activeTab]}
                      onPress={() => {
                        setBookingMode(tab);

                        if (tab === "Transfer") {
                          setSelectedHourly(null);
                          setHourlyWarning("");
                        }

                        if (tab === "Hourly") {
                          setFare(0);
                        }
                      }}
                    >
                      <Text
                        style={[styles.tabText, isSelected && styles.activeTabText]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <JourneyCard
                journeyData={journeyData}
                setJourneyData={setJourneyData}
                fare={fare}
                mode={bookingMode}
                screenMode={mode}
                booking={booking}
                selectedHourly={selectedHourly}
                setSelectedHourly={setSelectedHourly}
                hourlyData={hourlyData}
                colors={colors}
                symbol={symbol}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                values={values}
                validateForm={validateForm}
                isReturnJourney={isReturnJourney}
                setIsReturnJourney={setIsReturnJourney}
                onOpenReturnModal={() => setShowReturnJourneyModal(true)}
                hourlyWarning={hourlyWarning}
                oldAddresses={suggestionsData?.suggestions || []}
              />

              <VehicleSelection
                vehicles={data || []}
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                vehicleExtras={vehicleExtras}
                setVehicleExtras={setVehicleExtras}
                colors={colors}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />
              <CustomerInfo
                passengerDetails={passengerDetails}
                setPassengerDetails={(data) => {
                  setPassengerDetails(data);
                }}
                colors={colors}
                errors={errors}
                touched={touched}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                values={values}
                validateForm={validateForm}
                isCorporate={isCorporate}
                isEmailLocked={isCorporate || isSocialProvider}
              />
            </ScrollView>
          </View>
          <View style={styles.paymentContainer}>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                setShowPaymentMethods(!showPaymentMethods)
              }
              style={styles.paymentHeader}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentTitle}>
                  Select Payment Method
                </Text>
                {selectedPaymentMethod && (
                  <Text style={[styles.paymentTitle, { marginTop: 4, fontSize: 14, fontWeight: "500", color: colors.gray600 || colors.gray }]}>
                    {selectedPaymentMethod}
                  </Text>
                )}

                {isReturnJourney && (
                  <Text style={{ marginTop: 6, fontSize: 12, color: colors.gray600 || colors.gray }}>
                    Return included in primary payment
                  </Text>
                )}
              </View>

              <View style={styles.paymentHeaderRight}>

                {showPaymentMethods ? (
                  <Icons.ChevronUp
                    size={20}
                    color={colors.black}
                  />
                ) : (
                  <Icons.ChevronDown
                    size={20}
                    color={colors.black}
                  />
                )}
              </View>
            </TouchableOpacity>

            {showPaymentMethods && (
              <View style={styles.paymentCard}>

                {enabledPaymentMethods.map((item, index) => {

                  const isSelected =
                    selectedPaymentMethod === item.customName;

                  return (
                    <TouchableOpacity
                      key={item.paymentMethod}
                      activeOpacity={0.8}
                      onPress={() => {
                        setSelectedPaymentMethod(
                          item.customName
                        );

                        setShowPaymentMethods(false);
                      }}
                      style={[
                        styles.paymentItem,

                        isSelected &&
                        styles.paymentItemSelected,

                        index === enabledPaymentMethods.length - 1 &&
                        styles.paymentItemLast,
                      ]}
                    >
                      <Text
                        style={[
                          styles.paymentText,

                          isSelected &&
                          styles.paymentTextSelected,
                        ]}
                      >
                        {item.customName}
                      </Text>

                      {isSelected ? (
                        <Icons.CheckSquare
                          size={22}
                          color={colors.primary}
                        />
                      ) : (
                        <Icons.Square
                          size={22}
                          color={colors.gray400}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles?.buttonContainer}>
            <TouchableOpacity activeOpacity={0.7} style={styles?.button} onPress={handleSubmit}>
              <Text style={styles?.activeTabText}>{mode === "edit" ? "Update Booking" : "Create Booking"}</Text>
            </TouchableOpacity>
          </View>

          <ReturnJourneyModal
            visible={showReturnJourneyModal}
            onClose={handleCloseReturnModal}
            returnJourneyData={returnJourneyData}
            setReturnJourneyData={setReturnJourneyData}
            colors={colors}
            symbol={symbol}
            returnFare={returnFare}
            primaryJourneyData={journeyData}
          />

          <Modal
            visible={showPaypalWebView}
            animationType="slide"
            onRequestClose={() => {
              setShowPaypalWebView(false);
              paypalResolveRef.current?.(false);
              paypalResolveRef.current = null;
            }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  height: 55,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  backgroundColor: colors.primary,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowPaypalWebView(false);
                    paypalResolveRef.current?.(false);
                    paypalResolveRef.current = null;
                  }}
                >
                  <Text style={{ color: colors.white, fontSize: 16 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <Text
                  style={{
                    flex: 1,
                    textAlign: "center",
                    color: colors.white,
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  PayPal Payment
                </Text>

                <View style={{ width: 55 }} />
              </View>

              {!!paypalApprovalUrl && (
                <WebView
                  source={{ uri: paypalApprovalUrl }}
                  onNavigationStateChange={handlePaypalNavigation}
                  startInLoadingState
                />
              )}
            </View>
          </Modal>

          <LoaderModal
            visible={
              isPending ||
              updateBookingPending ||
              // paymentIsPending ||
              createOrderPending ||
              captureOrderPending
            }
          />
        </View>

      )}
    </Formik>
  );
};

export default NewBookingScreen;