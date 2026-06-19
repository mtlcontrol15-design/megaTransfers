export const parseJobDate = (job) => {
    const date = job?.booking?.primaryJourney?.date;

    if (!date) return null;

    const d = new Date(date);

    d.setHours(0, 0, 0, 0);

    return d;
};