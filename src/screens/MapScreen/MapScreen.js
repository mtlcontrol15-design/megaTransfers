import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Platform, Text, TouchableOpacity, View } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect, useTheme } from '@react-navigation/native';


import getStyles from "./style";
import Icons from '../../assets/icons';
import { getSocket } from '../../services/socket';
import { EndPoints } from '../../services/EndPoints';
import SwipeButton from '../../components/SwipeButton/SwipeButton';
import { dispatchOnlineStatus } from '../../redux/slices/userSlice';
import useQueryHandler from '../../services/queries/useQueryHandler';
import { requestLocationPermission } from '../../utils/permissionsHelper';
import { mutationHandler } from '../../services/mutations/mutationHandler';


const MapScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const dispatch = useDispatch();

  const [region, setRegion] = useState(null);
  const [heading, setHeading] = useState(0);
  const locationWatchRef = useRef(null);
  const locationIntervalRef = useRef(null);
  const latestPositionRef = useRef(null);

  const { user, isOnline } = useSelector(state => state.userReducer)
  const isDriver = user?.role === 'driver';

  const locationEndpoint = isDriver
    ? EndPoints.getDriverCurrentLocation
    : EndPoints.getCustomerAssignedDriverLocation;

  const shouldFetchLocation = Boolean(user?.companyId);

  const {
    data: liveLocationData,
    refetch: refetchLiveLocation,
  } = useQueryHandler(locationEndpoint, {
    enabled: shouldFetchLocation,
    keepPrevious: true,
    useInfiniteQueryFlag: false,
  });

  // console.log('=======usman testing  data is here', liveLocationData);


  const { mutate: mutateSaveLocation } = mutationHandler(
    EndPoints.saveLocation,
    null,
    () => {
      refetchLiveLocation();
    },
    (err) => {
      console.log('Live location save error:', err);
    },
    'post'
  );

  const currentLocation = useMemo(() => {
    return liveLocationData?.data?.location
      || liveLocationData?.location
      || liveLocationData?.data?.data?.location
      || null;
  }, [liveLocationData]);

  const bookingStatus =
    liveLocationData?.data?.booking?.status
      ?.trim()
      ?.toLowerCase() || "";

  const trackingEnded = [
    "new",
    "accepted",
    "no show",
    "completed",
    "cancelled",
    "late cancel",
  ].includes(bookingStatus);

  const stopWatchingLocation = useCallback(() => {
    if (locationWatchRef.current !== null) {
      Geolocation.clearWatch(locationWatchRef.current);
      locationWatchRef.current = null;
    }
  }, []);

  const applyLocation = useCallback((position) => {
    const { latitude, longitude, heading = 0 } = position.coords;

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setHeading(heading || 0);

    latestPositionRef.current = position;

  }, []);


  const startLocationInterval = useCallback(() => {
    if (locationIntervalRef.current) return;

    locationIntervalRef.current = setInterval(() => {
      const position = latestPositionRef.current;

      if (!position || !isDriver || !isOnline) return;

      const { latitude, longitude, accuracy = 0, speed = 0, heading = 0 } = position.coords;

      const payload = {
        latitude,
        longitude,
        isOnline: true,
      };

      mutateSaveLocation(payload);

      // ✅ socket emit
      const socket = getSocket();
      socket?.emit('map:location:updated', {
        ...payload,
        userId: user?._id,
        companyId: user?.companyId,
        employeeNumber: user?.employeeNumber,
      });

    }, 10000);
  }, [isDriver, isOnline, mutateSaveLocation, user]);
  const stopLocationInterval = useCallback(() => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  }, []);
  const startWatchingLocation = useCallback(async () => {
    if (!isDriver || !isOnline) {
      stopWatchingLocation();
      return;
    }

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    stopWatchingLocation();

    locationWatchRef.current = Geolocation.watchPosition(
      (position) => applyLocation(position),
      (error) => {
        console.log('Live location watch error:', error);
      },
      {
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 3000,
        timeout: 1500,
        maximumAge: 5000,
      }
    );
  }, [applyLocation, isDriver, isOnline, stopWatchingLocation]);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';

    const now = new Date();
    const updatedTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - updatedTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
  };

  const handleSwipe = useCallback(async (nextStatus) => {
    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        (position) => {
          applyLocation(position);

          const payload = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isOnline: nextStatus,
          };

          console.log('payload is here', payload);

          mutateSaveLocation(payload);

          dispatch(dispatchOnlineStatus(nextStatus));

          const socket = getSocket();

          socket?.emit('map:location:updated', {
            ...payload,
            userId: user?._id,
            companyId: user?.companyId,
            employeeNumber: user?.employeeNumber,
          });

          if (!nextStatus) {
            console.log("You are now OFFLINE");

            stopWatchingLocation();
            stopLocationInterval();
          } else {
            console.log("You are now ONLINE");

            startWatchingLocation();
            startLocationInterval();
          }
        },
        (error) => {
          console.log('Location error:', error);
        },
        { timeout: 1500 }
      );
    } catch (error) {
      console.log('Swipe error:', error);
    }
  }, [
    applyLocation,
    dispatch,
    mutateSaveLocation,
    startWatchingLocation,
    stopWatchingLocation,
    stopLocationInterval,
    startLocationInterval,
    user,
  ]);

  const isDriverOnlineFromAPI = currentLocation?.isOnline === true;
  const lastUpdated = currentLocation?.lastUpdated;
  const offlineDuration = getTimeAgo(lastUpdated);


  const openDirectionsWithSource = (destLat, destLng) => {
    if (!region) return;

    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${destLat || region.latitude},${destLng || region.longitude}`,
      android: `https://www.google.com/maps/search/?api=1&query=${destLat || region.latitude},${destLng || region.longitude}`,
    });

    Linking.openURL(url);
  };


  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const syncLocation = () => {
      if (shouldFetchLocation) {
        refetchLiveLocation();
      }
    };

    const socketEvents = [
      'socket:ready',
      'map:location:updated',
      'location:updated',
      'driver:location:updated',
    ];

    socketEvents.forEach((eventName) => socket.on(eventName, syncLocation));

    syncLocation();

    return () => {
      socketEvents.forEach((eventName) => socket.off(eventName, syncLocation));
    };
  }, [refetchLiveLocation, shouldFetchLocation]);

  useEffect(() => {
    if (isDriver || !shouldFetchLocation) return;

    const interval = setInterval(() => {
      refetchLiveLocation();
    }, 5000);

    return () => clearInterval(interval);
  }, [isDriver, shouldFetchLocation, refetchLiveLocation]);

  useEffect(() => {
    const requestPermissionForCustomer = async () => {
      if (!isDriver) {
        const hasPermission = await requestLocationPermission();

        if (hasPermission) {
          Geolocation.getCurrentPosition(
            (position) => {
              applyLocation(position);
            },
            (error) => {
              console.log('Customer location error:', error);
            }
          );
        }
      }
    };

    requestPermissionForCustomer();
  }, []);

  useEffect(() => {
    if (!isDriver && trackingEnded) {
      setRegion(null);
      return;
    }
    const nextLocation = currentLocation;
    if (!nextLocation) return;

    const latitude = nextLocation.latitude ?? nextLocation.lat;
    const longitude = nextLocation.longitude ?? nextLocation.lng;

    if (latitude == null || longitude == null) return;

    setRegion({
      latitude: Number(latitude),
      longitude: Number(longitude),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [currentLocation, isDriver, trackingEnded]);


  useFocusEffect(
    useCallback(() => {
      if (isDriver && isOnline) {
        startWatchingLocation();
        startLocationInterval();
      }

      return () => {
        stopWatchingLocation();
        stopLocationInterval();
      };
    }, [isDriver, isOnline])
  );

  const markerCoordinate = isDriver
    ? region
    : currentLocation;

  const shouldShowMarker = isDriver
    ? !!region
    : currentLocation?.isOnline && !trackingEnded;

  // console.log('======markerCoordinate are here', markerCoordinate);


  return (
    <View style={styles?.container}>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <Icons.ArrowLeft size={26} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {"Trip Route"}
        </Text>

        <TouchableOpacity activeOpacity={0.7} onPress={refetchLiveLocation}>
          <Icons.RefreshCcw size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
      <MapView
        style={styles?.mapview}
        region={region || undefined}
      >
        {markerCoordinate && shouldShowMarker && (
          <Marker
            coordinate={{
              latitude: Number(markerCoordinate.latitude),
              longitude: Number(markerCoordinate.longitude),
            }}
          >
            <View style={styles.markerOuter}>
              <View style={styles.markerInner}>
                <Icons.Car size={16} color={colors.lightGreen} />
              </View>
            </View>
          </Marker>
        )}
      </MapView>
      {!isDriver && trackingEnded && (
        <View style={styles.offlineMarker}>
          <Text style={{ color: "black" }}>
            Driver tracking is no longer available
          </Text>
        </View>
      )}

      {!isDriver && !trackingEnded && !isDriverOnlineFromAPI && (
        <View style={styles.offlineMarker}>
          <Text style={{ color: "black" }}>
            No driver online
          </Text>
        </View>
      )}
      <TouchableOpacity activeOpacity={0.7} style={styles?.iconWrepper} onPress={() => openDirectionsWithSource(region?.latitude, region?.longitude)}>
        <Icons.Navigation size={26} color={colors.white} />
      </TouchableOpacity>
      {isDriver && (
        <View style={{ paddingTop: moderateScale(15), paddingBottom: moderateScale(25), backgroundColor: colors?.primary }}>
          <SwipeButton colors={colors} onSwipeSuccess={handleSwipe} />
        </View>
      )}
    </View>
  );
};

export default MapScreen;
