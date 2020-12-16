import React, { useEffect, useState } from "react";
import { db, storage } from "../../firebase/firebase";
import AddPayment from "../components/AddPayment";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Modal, Form } from "antd";
import CheckCircle from "../../views/check.svg";

function NewProjectContainer({pendingPayments}) {
  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedProject, setSelectedProject] = useState("");
  const [cuota, setCuota] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [form] = Form.useForm();


  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleCuota = (value) => {
    setCuota(value);
  };


  async function success() {
    closeModal();
    const file = fileUrl.file.originFileObj;
    const storageRef = storage.ref();
    const task = storageRef.child(`comprobantesDePago/${fileUrl.file.name}`);
    await task.put(file);
    await task.getDownloadURL().then((downloadUrl) => {
      db.collection("payments").doc(payment.paymentId)
      .get()
      .then((doc)=>{
        const pago = doc.docs[0].id
        db.collection("payments").doc(pago).update({
          comprobantePago: downloadUrl
        })
      })
    })
      .then(() => {
        form.resetFields();
        console.log("Pago cargado correctamente!");
      })
      .then(() => {
        Modal.success({
          bodyStyle: {
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          },
          content: "¡Pago ingresado!",
          centered: "true",
          okText: "VOLVER",
          icon: <img src={CheckCircle} className="icono-sider" />,
          okButtonProps: {
            style: {
              backgroundColor: "#9e39ff",
              border: "none",
              borderRadius: "20px",
            },
          },
        });
      });
  }

  return (
    <AddPayment
      status={status}
      closeModal={closeModal}
      success={success}
      openModal={openModal}
      modal={modal}
      form={form}
      // users={users}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
      setSelectedProject={setSelectedProject}
      selectedProject={selectedProject}
      // projects={projects}
      fileUrl={fileUrl}
      setFileUrl={setFileUrl}
      handleCuota={handleCuota}
      pendingPayments={pendingPayments}
    />
  );
}

export default NewProjectContainer;
