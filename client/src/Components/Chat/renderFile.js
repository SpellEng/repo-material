import { RiFilePdf2Fill } from "react-icons/ri";
import { FcDocument } from "react-icons/fc";

export const renderFile = (file, noDownload) => {
    if (!file?.url) return null;

    if (file?.type?.startsWith('video')) {
        return <video src={file?.url} controls className="messageFile" />;
    }
    else if (file?.format?.startsWith("pdf")) {
        return <a href={file?.url} download target="_blank" className="messageFileLink d-flex align-items-center gap-2"><RiFilePdf2Fill /> {file?.name}.pdf</a>;
    }
    else if (
        file?.type?.startsWith("image")
    ) {
        return <div className="messageFile" >
            <img src={file?.url} alt="Uploaded file" />
            <br />
            {
                !noDownload &&
                <a href={file?.url} download target="_blank" className="mt-2 d-flex align-items-center justify-content-center gap-2">Download</a>
            }
        </div>
    }
    else {
        return <a href={file?.url} target="_blank" download className="messageFileLink d-flex align-items-center gap-2"><FcDocument /> {file?.name}</a>;
    }
};