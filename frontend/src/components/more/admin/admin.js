import React, { useEffect, useState } from 'react';
import NewUser from './newUser/newUser';
import Modal from "./modal/modal";
import EditUser from "./EditUser/editUser";
import Logs from "./logs/logs";
import './admin.css';

export default function Admin() {
  const [modalContent, setModalContent] = useState();
  const [modal, setModal] = useState(false)

  const open = (component) => {
    setModal(true);
    setModalContent(component);
  }

  return (
    <div>
      <div className="adminBody">

        {modal && <Modal closeModal={() => setModal(false)}>{modalContent}</Modal>}

        <div className="adminBox" onClick={() => open(<NewUser />)}>
          <h1>New User</h1>
          <p>Create a new User</p>
        </div>
        
        <div className="adminBox" onClick={() => open(<EditUser />)}>
          <h1>Edit User</h1>
          <p>Edit user data</p>
        </div>

        <div className="adminBox" onClick={() => open(<Logs />)}>
          <h1>Logs</h1>
          <p>Display website logs</p>
        </div>

        <div className="adminBox">
            <h1>something</h1>
        </div>
        <div className="adminBox"></div>
        <div className="adminBox"></div>
      </div>
    </div>
  );
}
