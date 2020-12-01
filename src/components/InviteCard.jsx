import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import UserLogo from "../../views/man.svg";
import { Modal, Button, Card, Input, Form } from "antd";
function InviteCard({ handleChange, closeModal, success, openModal, modal }) {
  return (
    <div className="Modal">
      <Card className="admin-cards" onClick={openModal}>
        <img src={UserLogo} className="icono-sider" />
        <div className="admin-button">
          <h4 style={{ color: "#9e39ff" }}>Invitar perfiles</h4>
        </div>
      </Card>

      <Modal
        visible={modal}
        centered="true"
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{
          hidden: true,
        }}
        onCancel={closeModal}
        closeIcon={<CloseCircleOutlined className="close-button" />}
        bodyStyle={{ color: "#9e39ff" }}
      >
        <>
          <div className="modal-style">
            <br />
            <h1>Invitar a un perfil</h1>
            <p style={{ color: "grey" }}>Ingresar el mail del perfil </p>
            <br />
          </div>
          <h5 style={{ color: "grey", marginLeft: "95px" }}>MAIL DEL PERFIL</h5>
          <Form onFinish={success}>
            <div>
              <Form.Item
                style={{ width: "60%", marginLeft: "95px" }}
                name="email"
                onChange={handleChange}
                rules={[
                  {
                    required: true,
                    message: "El email es requerido",
                  },
                  {
                    message: "Ingrese un mail válido",
                    type: "email",
                  },
                ]}
              >
                <Input placeholder="Ej: talentos@itesa.com.ar" name="email" />
              </Form.Item>
            </div>
            <div className="modal-input">
              <button className="ok-button" type="submit">
                INVITAR
              </button>
            </div>
          </Form>
        </>
      </Modal>
    </div>
  );
}

export default InviteCard;