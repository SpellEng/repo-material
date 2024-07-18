import { message } from "antd";

export const SuccessAlert = (messages) => {
    message.success({
        className: "ant-message",
        content: messages,
        duration: 4,
        style: { marginTop: '40px' }
    });
}
export const ErrorAlert = (messages) => {
    message.error({
        className: "ant-message",
        content: messages,
        duration: 4,
        style: { marginTop: '40px' }
    });

}
export const WarningAlert = (messages) => {
    message.warning({
        className: "ant-message",
        content: messages,
        duration: 4
    });
}