import { pick } from '@react-native-documents/picker'
import RNFS from 'react-native-fs';


const MAX_FILE_SIZE = 10 * 1024 * 1024;

const saveContentUriToFile = async (contentUri, fileName) => {
    const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

    // Read content:// and write to file://
    const data = await RNFS.readFile(contentUri, 'base64');
    await RNFS.writeFile(destPath, data, 'base64');

    return destPath;
};

export const pickDocument = async ({ type, onSuccess, onError }) => {
    try {
        if (type === "all") {
            // Show document picker first
            const res = await pick({ type: ['image/*', 'video/*', 'application/pdf'] });

            if (!res || res.length === 0) return;

            const file = res[0];

            // If PDF, convert content URI to file
            if (file.type === "application/pdf") {
                const localPath = await saveContentUriToFile(file.uri, file.name);
                onSuccess({
                    uri: `file://${localPath}`,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                });
            } else {
                // Image / video
                onSuccess(file);
            }
        }
    } catch (err) {
        if (err?.code === 'DOCUMENT_PICKER_CANCELED') return;
        onError(err.message || 'Failed to pick file');
    }
};
