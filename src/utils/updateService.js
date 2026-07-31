import SpInAppUpdates, {
    IAUUpdateKind,
} from 'sp-react-native-in-app-updates';

const updater = new SpInAppUpdates(false);

let checking = false;

export const checkForUpdate = async () => {

    if (checking) return;

    checking = true;

    try {

        const result = await updater.checkNeedsUpdate();

        // console.log(
        //     'ANDROID UPDATE RESULT:',
        //     JSON.stringify(result, null, 2),
        // );

        if (result.shouldUpdate) {
            await updater.startUpdate({
                updateType: IAUUpdateKind.IMMEDIATE,
            });
        }

    } catch (e) {
        console.log(e);
    }

    checking = false;
};