import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy } from "lucide-react";
import "./CopySection.css";
import { SuccessAlert } from "../../Messages/messages";

const CopySection = (props) => {

  const handleCopied = () => {
    SuccessAlert("Copied");
  }

  return (
    <div className="copyContainer">
      <div className="copyHeading">Copy Meeting Link</div>
      <div className="copyDescription">
        <CopyToClipboard text={window.location.href} onCopy={handleCopied}>
          <Copy className="ml-3 cursor-pointer" />
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default CopySection;