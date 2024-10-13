import React, { Fragment, useEffect, useState } from "react";
import LayoutOne from "../../layouts/LayoutOne";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <Fragment>
      <LayoutOne headerTop="visible">
        <div className="container my-5">
          <h2 className="text-center mb-4">All Users</h2>
          <div className="row">
            {users.map((user) => (
              <div key={user.ID} className="col-md-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{user.name}</h5>
                    <p className="card-text">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default AllUsers;
