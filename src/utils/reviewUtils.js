export const getCompletedAt = booking => {
    if (Array.isArray(booking?.statusAudit)) {
        const completedAudit = [...booking.statusAudit]
            .reverse()
            .find(
                audit =>
                    audit?.status
                        ?.trim()
                        ?.toLowerCase() === "completed",
            );

        const auditDate =
            completedAudit?.date ||
            completedAudit?.createdAt ||
            completedAudit?.updatedAt ||
            completedAudit?.timestamp ||
            completedAudit?.changedAt;

        if (auditDate) {
            return auditDate;
        }
    }

    return (
        booking?.completedAt ||
        booking?.updatedAt ||
        null
    );
};

export const isBookingReviewed = (
    booking,
    reviewedBookings = [],
) => {
    return (
        booking?.reviewed === true ||
        reviewedBookings.includes(booking?._id)
    );
};

export const isReviewWindowOpen = (
    booking,
    reviewedBookings = [],
) => {
    const status =
        booking?.status
            ?.trim()
            ?.toLowerCase() || "";

    if (status !== "completed") {
        return false;
    }

    if (
        isBookingReviewed(
            booking,
            reviewedBookings,
        )
    ) {
        return false;
    }

    const completedAt =
        getCompletedAt(booking);

    if (!completedAt) {
        return false;
    }

    const completedTime =
        new Date(completedAt).getTime();

    if (Number.isNaN(completedTime)) {
        return false;
    }

    const elapsedTime =
        Date.now() - completedTime;

    const reviewWindowMs =
        48 * 60 * 60 * 1000;

    return (
        elapsedTime >= 0 &&
        elapsedTime <= reviewWindowMs
    );
};