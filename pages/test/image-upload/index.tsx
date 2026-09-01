import UploadImageForm from "@sera-components/upload-img-form/UploadImageForm";
import { decryptDataGCM, encryptDataGCM } from "@sera-utils/encryptor";
import { useState } from "react";
import { connect } from "react-redux";

const UploadPage = () => {
  const [encryptedData, setEncryptedData] = useState<string>("");
  const [decryptedData, setDenryptedData] = useState<string>("");

  return (
    <div>
      <h1>Upload Image</h1>

      <UploadImageForm />

      <div style={{ marginTop: "60px" }}>
        <h1>Encrypt AES-256</h1>

        <div style={{ marginTop: "20px" }}>
          <button
            id="test-encrypt"
            type="button"
            onClick={async () => {
              const strKey =
                "9b87e07855ebb52615294994ad4872423dccca81e57d9b34c14906e7712501e8";
              const strIv = "2d5d75734ed86f72b8b4e91f3fe25ffa";
              const plainText = "Test Encrypt";

              const encryptedText = await encryptDataGCM(
                plainText,
                strKey,
                strIv,
              );
              setEncryptedData(encryptedText);
            }}
          >
            Encrypt Data
          </button>

          <div>Plain Text: Test Encrypt</div>
          <div>Encrypted Data: {encryptedData}</div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            id="test-encrypt"
            type="button"
            onClick={async () => {
              const strKey =
                "9b87e07855ebb52615294994ad4872423dccca81e57d9b34c14906e7712501e8";
              const strIv = "2d5d75734ed86f72b8b4e91f3fe25ffa";
              const plainText = "C2pCvIcaOaId350i6hDldOBRlu/1GGTWP2WlsA==";

              const encryptedText = await decryptDataGCM(
                plainText,
                strKey,
                strIv,
              );
              setDenryptedData(encryptedText);
            }}
          >
            Decrypt Data
          </button>

          <div>Encrypt Data: C2pCvIcaOaId350i6hDldOBRlu/1GGTWP2WlsA==</div>
          <div>Decrypted Data: {decryptedData}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UploadPage);
