import { useEffect, useState } from "react";
import "./App.css";

// ================= BACKEND API URL =================
// Local testing uses localhost.
// After deployment, VITE_API_URL will use your Render backend.
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  // ================= LOGIN =================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [showLogin, setShowLogin] = useState(false);

  // ================= REGISTER =================
  const [showRegister, setShowRegister] = useState(false);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRole, setRegisterRole] = useState("receiver");
  const [registerMessage, setRegisterMessage] = useState("");

  // ================= USER =================
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ================= DONATE FOOD =================
  const [showDonate, setShowDonate] = useState(false);

  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [donateMessage, setDonateMessage] = useState("");

  // ================= FIND FOOD =================
  const [availableFood, setAvailableFood] = useState([]);
  const [foodMessage, setFoodMessage] = useState("");

  // ================= REQUEST FOOD =================
  const [requestMessage, setRequestMessage] = useState("");

  // ================= MY REQUESTS =================
  const [myRequests, setMyRequests] = useState([]);
  const [requestsMessage, setRequestsMessage] = useState("");

  // ================= MY DONATIONS =================
  const [myDonations, setMyDonations] = useState([]);
  const [donationsMessage, setDonationsMessage] = useState("");

  // ================= ADMIN =================
  const [adminFood, setAdminFood] = useState([]);
  const [adminRequests, setAdminRequests] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  const [adminFoodMessage, setAdminFoodMessage] = useState("");
  const [adminRequestsMessage, setAdminRequestsMessage] = useState("");
  const [adminUsersMessage, setAdminUsersMessage] = useState("");

  // ================= LOAD USER =================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, []);

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setLoggedInUser(data.user);

        setMessage(
          `Login successful! Welcome ${data.user.name}`
        );

        setShowLogin(false);

        setEmail("");
        setPassword("");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Unable to connect to the server.");
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
            role: registerRole,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRegisterMessage(
          "Registration successful! You can now login."
        );

        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterRole("receiver");

        setTimeout(() => {
          setShowRegister(false);
          setShowLogin(true);
          setRegisterMessage("");
        }, 1500);
      } else {
        setRegisterMessage(data.message);
      }
    } catch (error) {
      setRegisterMessage(
        "Unable to connect to the server."
      );
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setLoggedInUser(null);

    setMessage("Logged out successfully.");

    setAvailableFood([]);
    setMyRequests([]);
    setMyDonations([]);
    setShowDonate(false);
  };

  // ================= DONATE FOOD =================
  const handleDonateFood = async (e) => {
    e.preventDefault();

    if (!loggedInUser) {
      setDonateMessage(
        "Please login before donating food."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/food/donate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            foodName,
            quantity,
            description,
            location,
            donor: loggedInUser.id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDonateMessage(
          "Food donated successfully!"
        );

        setFoodName("");
        setQuantity("");
        setDescription("");
        setLocation("");
      } else {
        setDonateMessage(data.message);
      }
    } catch (error) {
      setDonateMessage(
        "Unable to connect to the server."
      );
    }
  };

  // ================= MY DONATIONS =================
  const handleMyDonations = async () => {
    if (!loggedInUser) {
      setDonationsMessage(
        "Please login to view your donations."
      );
      return;
    }

    setDonationsMessage(
      "Loading your donations..."
    );

    try {
      const response = await fetch(
        `${API_URL}/api/food/my-donations?donor=${loggedInUser.id}`
      );

      const data = await response.json();

      if (response.ok) {
        setMyDonations(data.food);

        if (data.food.length === 0) {
          setDonationsMessage(
            "You have no food donations yet."
          );
        } else {
          setDonationsMessage("");
        }
      } else {
        setDonationsMessage(data.message);
      }
    } catch (error) {
      setDonationsMessage(
        "Unable to connect to the server."
      );
    }
  };

  // ================= FIND FOOD =================
  const handleFindFood = async () => {
    setFoodMessage(
      "Loading available food..."
    );

    setRequestMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/food/available`
      );

      const data = await response.json();

      if (response.ok) {
        setAvailableFood(data.food);

        if (data.food.length === 0) {
          setFoodMessage(
            "No food is currently available."
          );
        } else {
          setFoodMessage("");
        }
      } else {
        setFoodMessage(data.message);
      }
    } catch (error) {
      setFoodMessage(
        "Unable to connect to the server."
      );
    }
  };

  // ================= REQUEST FOOD =================
  const handleRequestFood = async (foodId) => {
    if (!loggedInUser) {
      setRequestMessage(
        "Please login before requesting food."
      );
      return;
    }

    setRequestMessage(
      "Sending food request..."
    );

    try {
      const response = await fetch(
        `${API_URL}/api/food-request/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiver: loggedInUser.id,
            food: foodId,
            quantity: 1,
            message:
              "I would like to request this food.",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRequestMessage(
          "Food requested successfully!"
        );
      } else {
        setRequestMessage(data.message);
      }
    } catch (error) {
      setRequestMessage(
        "Unable to connect to the server."
      );
    }
  };

  // ================= MY REQUESTS =================
  const handleMyRequests = async () => {
    if (!loggedInUser) {
      setRequestsMessage(
        "Please login to view your requests."
      );
      return;
    }

    setRequestsMessage(
      "Loading your requests..."
    );

    try {
      const response = await fetch(
        `${API_URL}/api/food-request/all`
      );

      const data = await response.json();

      if (response.ok) {
        const userRequests =
          data.requests.filter(
            (request) =>
              request.receiver?._id ===
              loggedInUser.id
          );

        setMyRequests(userRequests);

        if (userRequests.length === 0) {
          setRequestsMessage(
            "You have no food requests."
          );
        } else {
          setRequestsMessage("");
        }
      } else {
        setRequestsMessage(data.message);
      }
    } catch (error) {
      setRequestsMessage(
        "Unable to connect to the server."
      );
    }
  };

  // ================= ADMIN USERS =================
  const handleAdminUsers = async () => {
    setAdminUsersMessage(
      "Loading users..."
    );

    try {
      const response = await fetch(
        `${API_URL}/api/users/all`
      );

      const data = await response.json();

      if (response.ok) {
        setAdminUsers(data.users);

        if (data.users.length === 0) {
          setAdminUsersMessage(
            "No users found."
          );
        } else {
          setAdminUsersMessage("");
        }
      } else {
        setAdminUsersMessage(data.message);
      }
    } catch (error) {
      setAdminUsersMessage(
        "Unable to connect to the server."
      );
    }
  };

  // ================= ADMIN FOOD =================
  const handleAdminFood = async () => {
    setAdminFoodMessage(
      "Loading food donations..."
    );

    try {
      const response = await fetch(
        `${API_URL}/api/food/available`
      );

      const data = await response.json();

      if (response.ok) {
        setAdminFood(data.food);

        if (data.food.length === 0) {
          setAdminFoodMessage(
            "No food donations found."
          );
        } else {
          setAdminFoodMessage("");
        }
      } else {
        setAdminFoodMessage(data.message);
      }
    } catch (error) {
      setAdminFoodMessage(
        "Unable to connect to the server."
      );
    }
  };

  // ================= ADMIN REQUESTS =================
  const handleAdminRequests = async () => {
    setAdminRequestsMessage(
      "Loading food requests..."
    );

    try {
      const response = await fetch(
        `${API_URL}/api/food-request/all`
      );

      const data = await response.json();

      if (response.ok) {
        setAdminRequests(data.requests);

        if (data.requests.length === 0) {
          setAdminRequestsMessage(
            "No food requests found."
          );
        } else {
          setAdminRequestsMessage("");
        }
      } else {
        setAdminRequestsMessage(data.message);
      }
    } catch (error) {
      setAdminRequestsMessage(
        "Unable to connect to the server."
      );
    }
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}
      <header>
        <h1>🍲 NO HUNGER</h1>

        <nav>
          <a href="#home">Home</a>

          {loggedInUser?.role === "donor" && (
            <>
              <a
                href="#donate"
                onClick={() => setShowDonate(true)}
              >
                Donate Food
              </a>

              <a href="#my-donations">
                My Donations
              </a>
            </>
          )}

          {loggedInUser?.role === "receiver" && (
            <>
              <a href="#find-food">
                Find Food
              </a>

              <a href="#my-requests">
                My Requests
              </a>
            </>
          )}

          {loggedInUser?.role === "admin" && (
            <a href="#admin-dashboard">
              Admin Dashboard
            </a>
          )}

          {!loggedInUser && (
            <button
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Login
            </button>
          )}

          {loggedInUser && (
            <button onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      {/* ================= HOME ================= */}
      <section id="home">
        <h2>Welcome to NO HUNGER 🍲</h2>

        <p>
          Together, we can reduce food waste
          and help people in need.
        </p>

        {loggedInUser && (
          <p>
            Welcome,{" "}
            <strong>{loggedInUser.name}</strong>!
          </p>
        )}

        {message && <p>{message}</p>}
      </section>

      {/* ================= LOGIN ================= */}
      {showLogin && (
        <section className="login-section">
          <h2>Login</h2>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Login
            </button>

            <button
              type="button"
              onClick={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
            >
              Create New Account
            </button>

            <button
              type="button"
              className="close-button"
              onClick={() => {
                setShowLogin(false);
                setMessage("");
              }}
            >
              Close
            </button>
          </form>
        </section>
      )}

      {/* ================= REGISTER ================= */}
      {showRegister && (
        <section className="login-section">
          <h2>Create NO HUNGER Account</h2>

          <form
            className="login-form"
            onSubmit={handleRegister}
          >
            <input
              type="text"
              placeholder="Enter your name"
              value={registerName}
              onChange={(e) =>
                setRegisterName(e.target.value)
              }
              required
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={registerEmail}
              onChange={(e) =>
                setRegisterEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Create a password"
              value={registerPassword}
              onChange={(e) =>
                setRegisterPassword(e.target.value)
              }
              required
            />

            <select
              value={registerRole}
              onChange={(e) =>
                setRegisterRole(e.target.value)
              }
            >
              <option value="receiver">
                Receiver
              </option>

              <option value="donor">
                Donor
              </option>
            </select>

            <button type="submit">
              Register
            </button>

            <button
              type="button"
              className="close-button"
              onClick={() => {
                setShowRegister(false);
                setRegisterMessage("");
              }}
            >
              Close
            </button>
          </form>

          {registerMessage && (
            <p>{registerMessage}</p>
          )}
        </section>
      )}

      {/* ================= DONATE FOOD ================= */}
      {loggedInUser?.role === "donor" &&
        showDonate && (
          <section
            id="donate"
            className="login-section"
          >
            <h2>🍲 Donate Food</h2>

            <form
              className="login-form"
              onSubmit={handleDonateFood}
            >
              <input
                type="text"
                placeholder="Food name"
                value={foodName}
                onChange={(e) =>
                  setFoodName(e.target.value)
                }
                required
              />

              <input
                type="text"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                required
              />

              <textarea
                placeholder="Food description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                required
              />

              <button type="submit">
                🍲 Donate Food
              </button>
            </form>

            {donateMessage && (
              <p>{donateMessage}</p>
            )}
          </section>
        )}
        {/* ================= MY DONATIONS ================= */}

      {loggedInUser?.role === "donor" && (
        <section id="my-donations">
          <h2>📦 My Donations</h2>

          <p>
            View the food you have donated through
            NO HUNGER.
          </p>

          <button onClick={handleMyDonations}>
            My Donations
          </button>

          {donationsMessage && (
            <p>{donationsMessage}</p>
          )}

          {myDonations.length > 0 && (
            <div>
              <h3>Your Food Donations</h3>

              {myDonations.map((food) => (
                <div key={food._id}>
                  <h4>{food.foodName}</h4>

                  <p>
                    <strong>Quantity:</strong>{" "}
                    {food.quantity}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {food.description ||
                      "No description"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {food.location}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {food.status}
                  </p>

                  <hr />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= FIND FOOD ================= */}

      {loggedInUser?.role === "receiver" && (
        <section id="find-food">
          <h2>🔎 Find Food</h2>

          <p>
            Find available food donations.
          </p>

          <button onClick={handleFindFood}>
            Find Available Food
          </button>

          {foodMessage && (
            <p>{foodMessage}</p>
          )}

          {availableFood.length > 0 && (
            <div>
              <h3>Available Food</h3>

              {availableFood.map((food) => (
                <div key={food._id}>
                  <h4>{food.foodName}</h4>

                  <p>
                    <strong>Quantity:</strong>{" "}
                    {food.quantity}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {food.description ||
                      "No description"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {food.location}
                  </p>

                  <p>
                    <strong>Donor:</strong>{" "}
                    {food.donor?.name || "Unknown"}
                  </p>

                  <button
                    onClick={() =>
                      handleRequestFood(food._id)
                    }
                  >
                    Request Food
                  </button>

                  <hr />
                </div>
              ))}
            </div>
          )}

          {requestMessage && (
            <p>{requestMessage}</p>
          )}
        </section>
      )}

      {/* ================= MY REQUESTS ================= */}

      {loggedInUser?.role === "receiver" && (
        <section id="my-requests">
          <h2>📋 My Requests</h2>

          <p>
            View the food you have requested.
          </p>

          <button onClick={handleMyRequests}>
            My Requests
          </button>

          {requestsMessage && (
            <p>{requestsMessage}</p>
          )}

          {myRequests.length > 0 && (
            <div>
              <h3>Your Requests</h3>

              {myRequests.map((request) => (
                <div key={request._id}>
                  <p>
                    <strong>Food:</strong>{" "}
                    {request.food?.foodName ||
                      "Unknown"}
                  </p>

                  <p>
                    <strong>Quantity:</strong>{" "}
                    {request.quantity}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {request.food?.location ||
                      "Unknown"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {request.status}
                  </p>

                  <hr />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ================= ADMIN DASHBOARD ================= */}

      {loggedInUser?.role === "admin" && (
        <section id="admin-dashboard">
          <h2>🛠️ Admin Dashboard</h2>

          <p>
            Welcome to the NO HUNGER administration
            area.
          </p>

          {/* ================= VIEW USERS ================= */}

          <div>
            <h3>👥 Manage Users</h3>

            <p>
              Admin can view donors, receivers and
              administrators.
            </p>

            <button onClick={handleAdminUsers}>
              View Users
            </button>

            {adminUsersMessage && (
              <p>{adminUsersMessage}</p>
            )}

            {adminUsers.length > 0 && (
              <div>
                <h3>Registered Users</h3>

                {adminUsers.map((user) => (
                  <div key={user._id}>
                    <h4>{user.name}</h4>

                    <p>
                      <strong>Email:</strong>{" "}
                      {user.email}
                    </p>

                    <p>
                      <strong>Role:</strong>{" "}
                      {user.role}
                    </p>

                    <hr />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= VIEW FOOD ================= */}

          <div>
            <h3>🍲 Manage Food</h3>

            <p>
              Admin can view available food donations.
            </p>

            <button onClick={handleAdminFood}>
              View Food
            </button>

            {adminFoodMessage && (
              <p>{adminFoodMessage}</p>
            )}

            {adminFood.length > 0 && (
              <div>
                <h3>Food Donations</h3>

                {adminFood.map((food) => (
                  <div key={food._id}>
                    <h4>{food.foodName}</h4>

                    <p>
                      <strong>Quantity:</strong>{" "}
                      {food.quantity}
                    </p>

                    <p>
                      <strong>Description:</strong>{" "}
                      {food.description ||
                        "No description"}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {food.location}
                    </p>

                    <p>
                      <strong>Donor:</strong>{" "}
                      {food.donor?.name ||
                        "Unknown"}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {food.status}
                    </p>

                    <hr />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= VIEW REQUESTS ================= */}

          <div>
            <h3>📋 Manage Requests</h3>

            <p>
              Admin can view all food requests.
            </p>

            <button onClick={handleAdminRequests}>
              View Requests
            </button>

            {adminRequestsMessage && (
              <p>{adminRequestsMessage}</p>
            )}

            {adminRequests.length > 0 && (
              <div>
                <h3>Food Requests</h3>

                {adminRequests.map((request) => (
                  <div key={request._id}>
                    <p>
                      <strong>Receiver:</strong>{" "}
                      {request.receiver?.name ||
                        "Unknown"}
                    </p>

                    <p>
                      <strong>Food:</strong>{" "}
                      {request.food?.foodName ||
                        "Unknown"}
                    </p>

                    <p>
                      <strong>Quantity:</strong>{" "}
                      {request.quantity}
                    </p>

                    <p>
                      <strong>Message:</strong>{" "}
                      {request.message ||
                        "No message"}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {request.status}
                    </p>

                    <hr />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}

      <footer>
        <h3>🍲 NO HUNGER</h3>

        <p>
          Together, we can reduce food waste and
          help people in need.
        </p>

        <p>
          © 2026 NO HUNGER | Food for everyone
        </p>
      </footer>

    </div>
  );
}

export default App;