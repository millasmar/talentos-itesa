import React, { useRef, useState,useEffect } from "react";
import SignedContractUserProject from "./pdfs/SignedContractUserProject";
import ContractUserProject from './pdfs/ContractUserProject'
import { useRecoilState } from "recoil";
import { projectInvited, user,isLoading } from "../atoms/index";
import { db } from "../../firebase/firebase";
import { storage } from "../../firebase/firebase";

// PAQUETES
import SignatureCanvas from "react-signature-canvas";
import { pdf } from "@react-pdf/renderer";

// STYLES
import { Col, Row, Button, Alert, Modal } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import CheckCircle from "../../views/check.svg";

export default ({ setItem}) => {
  const [invitedProject, setInvitedProject] = useRecoilState(projectInvited);
  const [currentUser, setCurrentUser] = useRecoilState(user);
  const signatureRef = useRef({});
  const [imageData, setImageData] = useState("");
  const [errorSignature, setErrorSignature] = useState(false);
  const [show, setShow] = useState(false);
  const [loadingbtn, setLoadingbtn] =useRecoilState(isLoading)
  const [disableButton,setDisableButton]=useState(false)



  useEffect(()=>{
    setLoadingbtn(false)
  },[])

  const showModal = () => {
    setShow(true);
  };

  const handleOk = () => {
    setShow(false);
    setItem(1);
  };

  const saveSignature = (signature) => {
    setImageData(signature);
  };

  const handleSubmit = (e, div) => {
    showModal();
    if (!imageData) return setErrorSignature(true);
    const blob = pdf(
      <SignedContractUserProject
        project={invitedProject.selected}
        imageData={imageData}
      />
    );
    blob
      .toBlob()
      .then((file) => {
        const storageRef = storage.ref();
        //nombre del pdf a guardar en el storage verificar
        const dataName =
          invitedProject.selected.proyecto + "-" + currentUser.lastName;
        const pdfsRef = storageRef.child(`contractUserProject/${dataName}.pdf`);
        pdfsRef
          .put(file)
          .then(function (snapshot) {
            console.log("Uploaded a blob or file!");
          })
          .then(() => {
            return pdfsRef.getDownloadURL().then((downloadUrl) => {
              db.collection("projects")
                .doc(invitedProject.selected.projectId)
                .collection("invitedUser")
                .doc(invitedProject.selected.id)
                .update({
                  status: "On Development",
                  urlContractProject: downloadUrl,
                  signed: true,
                });
            });
          });
      })
      .then(() => {
        db.collection("payments")
          .where("userId", "==", invitedProject.selected.id)
          .where("projectId", "==", invitedProject.selected.projectId)
          .where("proyectoAceptado", "==", false)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let paymentRef = db.collection("payments").doc(doc.id);
              paymentRef
                .update({ proyectoAceptado: true })
                .then(() => console.log("Payment Actualizado!"));
            });
          })
          .catch((err) => console.log("ERROR ACTUALIZANDO PAGOS", err));
      })
      .then(() => {
        let userRef = db.collection("users").doc(invitedProject.selected.id);
        userRef
          .get()
          .then((doc) => {
            if (!doc.exists) {
              console.log("No such document!");
            } else {
              let user = doc.data();
              userRef.update({
                activeProjectsCounter: user.activeProjectsCounter + 1,
              });
            }
          })
          .catch((err) => {
            console.log("Error getting document", err);
          });
      });
  };

  return (
    <Row>
      <Col span={12} className="col-contract">
        <ContractUserProject project={invitedProject.selected} />
      </Col>

      <Col span={12} className="col-contract">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h1 style={{ color: "gray", textAlign: "center" }}>
            Revisá el contrato y firmá en el recuadro para aceptar el de
            Proyecto
          </h1>
          <br />
          <SignatureCanvas
            ref={signatureRef}
            velocityFilterWeight={0.3}
            penColor="black"
            canvasProps={{
              width: 400,
              height: 150,
              className: "sigCanvas",
              style: { border: "1px solid #000000", borderRadius: "25px" },
            }}
            onEnd={() => {
              saveSignature(
                signatureRef.current.getTrimmedCanvas().toDataURL("image/jpg")
              ); //base64
              setErrorSignature(false);
              setDisableButton(true);
            }}
          />
          <br></br>
          <Button
            shape="round"
            block
            htmlType="submit"
            id="accept-project-button"
            onClick={() => {
              signatureRef.current.clear();
              saveSignature(null);
              setDisableButton(false);
            }}
          >
            Reset
          </Button>
          {errorSignature && (
            <Alert
              message="You need to sign the document to complete the register"
              type="error"
              showIcon
              style={{ margin: 5 }}
            />
          )}
          {disableButton && (
            <Button
              onClick={handleSubmit}
              shape="round"
              block
              htmlType="submit"
              id="accept-project-button"
              loading={show}
            >
              Firmar Contrato
            </Button>
          )}

          <Modal
            visible={show}
            centered="true"
            cancelButtonProps={{ hidden: true }}
            okButtonProps={{
              hidden: true,
            }}
            bodyStyle={{ color: "#9e39ff" }}
            closeIcon={<CloseCircleOutlined className="close-button" />}
            onCancel={handleOk}
          >
            <>
              <div className="modal-style">
                <img src={CheckCircle} className="icono-sider" />
                <br/>
                <h1> ¡Proyecto Firmado! </h1>
                <p style={{ color: "grey" }}> Tu firma ha sido registrada! </p>
                <br />
              </div>
              <div className="modal-input">
                <Button
                  style={{
                    backgroundColor: "#9e39ff",
                    border: "none",
                    borderRadius: "20px",
                    color:"white"
                  }}
                  type="submit"
                  onClick={handleOk}
                >
                  VOLVER
                </Button>
              </div>
            </>
          </Modal>
        </div>
      </Col>
    </Row>
  );
};
