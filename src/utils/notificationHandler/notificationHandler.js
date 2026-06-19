import messaging from '@react-native-firebase/messaging';
import notifee, {
    AndroidImportance,
    AndroidStyle,
} from '@notifee/react-native';
import { navigate } from '../../navigation/RootNavigation';

const parseNotifeeData = (remoteMessage) => {
    let notifData = {};

    if (remoteMessage?.data?.notifee) {
        const value = remoteMessage.data.notifee;

        if (typeof value === 'object' && value !== null) {
            notifData = value;
        } else if (typeof value === 'string') {
            const trimmed = value.trim();

            if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
                try {
                    notifData = JSON.parse(value);
                } catch {
                    notifData = { body: value };
                }
            } else {
                notifData = { body: value };
            }
        }
    }

    return notifData;
};

const getNotificationContent = (remoteMessage, notifData = {}) => {
    const title =
        notifData.title ||
        remoteMessage?.notification?.title ||
        remoteMessage?.data?.title ||
        'New Notification';

    const body =
        notifData.body ||
        remoteMessage?.notification?.body ||
        remoteMessage?.data?.body ||
        '';

    return { title, body };
};

const createChannel = async () => {
    return await notifee.createChannel({
        id: 'important',
        name: 'Important Notifications',
        importance: AndroidImportance.HIGH,
        sound: 'default',
    });
};

const displayNotification = async (title, body, data) => {
    const channelId = await createChannel();

    await notifee.displayNotification({
        title,
        body,
        data,
        android: {
            channelId,
            importance: AndroidImportance.HIGH,
            pressAction: { id: 'default' },
            style: {
                type: AndroidStyle.BIGTEXT,
                text: body,
            },
            smallIcon: 'ic_launcher',
            color: '#FF0000',
        },
    });
};

export const registerBackgroundHandler = () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Background message received:', remoteMessage);

        const notifData = parseNotifeeData(remoteMessage);
        const { title, body } = getNotificationContent(remoteMessage, notifData);

        await displayNotification(title, body, remoteMessage.data);
    });


    notifee.onBackgroundEvent(async ({ type, detail }) => {
        const { notification } = detail;

        if (type === 1) { // PRESS
            const data = detail.notification?.data;
            const screen = data?.screen;
            const jobId = data?.jobId;
            const bookingId = data?.bookingId;
            const userId = data?.senderId;

            if (userId) {

                navigate("Chat", {
                    userId,
                });

                return;
            }

            // JOURNEY DETAILS

            if (
                screen === "JourneyDetails" ||
                screen === "BookingDetails"
            ) {

                navigate("JourneyDetails", {
                    bookingId,
                });

                return;
            }

            // JOB DETAILS

            if (screen === "JobDetails") {

                navigate("JobDetails", {
                    jobId,
                });

                return;
            }
        }

        if (notification?.id) {
            await notifee.cancelNotification(notification.id);
        }
    });
};


export const registerForegroundHandler = () => {
    const unsubscribeMessage = messaging().onMessage(async (remoteMessage) => {
        console.log('forground message received:', remoteMessage);
        const notifData = parseNotifeeData(remoteMessage);
        const { title, body } = getNotificationContent(remoteMessage, notifData);

        await notifee.displayNotification({
            title,
            body,
            android: {
                channelId: await createChannel(),
                pressAction: { id: 'default' },
            },
            data: remoteMessage.data,
        });
    });

    const unsubscribePress = notifee.onForegroundEvent(({ type, detail }) => {
        if (type === 1) {
            const data = detail.notification?.data;
            const screen = data?.screen;
            const jobId = data?.jobId;
            const bookingId = data?.bookingId;
            const userId = data?.senderId;

            if (userId) {

                navigate("Chat", {
                    userId,
                });

                return;
            }

            // JOURNEY DETAILS

            if (
                screen === "JourneyDetails" ||
                screen === "BookingDetails"
            ) {

                navigate("JourneyDetails", {
                    bookingId,
                });

                return;
            }

            // JOB DETAILS

            if (screen === "JobDetails") {

                navigate("JobDetails", {
                    jobId,
                });

                return;
            }
        }
    });

    return () => {
        unsubscribeMessage();
        unsubscribePress();
    };
};

export const showLocalNotification = async ({
    title = 'Test Notification',
    body = 'This is a local notification',
} = {}) => {
    const channelId = await notifee.createChannel({
        id: 'important',
        name: 'Important Notifications',
        importance: AndroidImportance.HIGH,
        sound: 'default',
    });

    await notifee.displayNotification({
        title,
        body,
        android: {
            channelId,
            importance: AndroidImportance.HIGH,
            pressAction: { id: 'default' },
            style: {
                type: AndroidStyle.BIGTEXT,
                text: body,
            },
            smallIcon: 'ic_launcher',
            color: '#FF0000',
        },
    });
};