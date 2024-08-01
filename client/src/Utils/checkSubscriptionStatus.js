import moment from "moment"

export const checkSubscriptionStatus = (date) => {
    const expiryDate = moment(date, "DD/MM/YYYY");
    const nowDate = moment();

    return nowDate.isAfter(expiryDate);
}