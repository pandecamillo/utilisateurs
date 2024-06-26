import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import HeaderUser from "../components/headerUser";
import connection from "../connection";

function PageUserEdit() {
  const [user, setUser] = React.useState({
    usernom: "",
    userprenom: "",
    userphone: "",
  });
  const [pageLoaded, setLoaded] = React.useState(false);
  const location = useLocation();

  const locationuserid = location.pathname.split("/")[2];
  console.log("read user :" + locationuserid);

  React.useEffect(
    function () {
      async function getUserData(iduser) {
        try {
          const appMessage = document.getElementById("app-message");
          console.log("send request");
          appMessage.innerHTML = waitElement;
          const res = await axios.get(connection + "/user/" + iduser);
          appMessage.style.display = "none";
          console.log("get response");
          console.log(res.data[0]);
          setUser({
            usernom: res.data[0].usernom,
            userprenom: res.data[0].userprenom,
            userphone: res.data[0].userphone,
          });
          setLoaded(true);
        } catch (e) {
          const appMessage = document.getElementById("app-message");
          appMessage.innerHTML = requestFalureElement;
          console.log("Erreur lors de la connection au server" + e);
        }
      }
      getUserData(locationuserid);
    },
    [locationuserid]
  );

  function handleChange(event) {
    setUser((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  const navigate = useNavigate();

  function goToApp() {
    navigate("/");
  }

  async function editUser() {
    if (user.usernom === "" || user.userprenom === "") {
      alert("Vous devez remplir le champ");
      return;
    }
    if (!user.userphone) {
      alert("Veuillez donner votre numero");
      return;
    }
    if (user.userphone.length != 9) {
      alert("Votre numero doit avoir 9 chiffres");
      return;
    }
    document.getElementById("btn-ajout").disabled = true;
    try {
      console.log("send request");
      document.getElementById("info-message").style.visibility = "visible";
      const res = await axios.put(connection + "/user/" + locationuserid, user);
      document.getElementById("info-message").style.visibility = "hidden";
      console.log("get response");
      goToApp();
    } catch {
      console.log("Erreur lors de l'ajout");
      //document.getElementById("container")
      //.innerHTML = "<p>Erreur lors de la connection au server.</p>";
    }
  }

  /*function convertToBase64(file) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        setUser((user) => ({ ...user, userprofile: reader.result }));
        console.log(user);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function importData() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = (_) => {
      // you can use this method to get file and perform respective operations
      let files = Array.from(input.files)[0];
      convertToBase64(files);
    };
    input.click();
  }*/

  function handlePhone(event) {
    if (user.userphone.length === 9) {
      console.log(user.userphone);
      event.preventDefault();
    }
  }

  function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  const waitElement = `<img
                            src="../icons/wait.gif"
                            style="width:80%;"
                          />`;
  const requestFalureElement = `<img
                                        src="../icons/no-wifi.png"
                                        style="width:100%;"
                                    />
                                    <p 
                                    style="font-weight:bolder;
                                    font-size:1rem;
                                     margin:20px;
                                     text-align:center;
                                      color: orange">
                                    Erreur au niveau du serveur
                                    </p>
                                    <small style="font-weight:small;font-size:small; margin:20px; text-align:center">
                                        Veuillez réessayer plus tard
                                    </small>`;

  return (
    <div className="app-container">
      <HeaderUser type="MODIFIER AMI" />
      {!pageLoaded && <div id="app-message" className="app-message"></div>}
      {pageLoaded && (
        <div className="form">
          <p className="info-message" id="info-message">
            Veuillez patienter ...
          </p>
          <div className="user-profile-input">
            <img
              id="user-profile"
              className="user-profile"
              src="../img/user-profile.png"
              alt="profile"
              //onClick={importData}
            />
          </div>
          <input
            autoComplete="off"
            maxLength={15}
            type="text"
            name="usernom"
            onChange={handleChange}
            placeholder="Votre nom"
            value={user.usernom}
          />
          <input
            autoComplete="off"
            maxLength={15}
            type="text"
            name="userprenom"
            onChange={handleChange}
            placeholder="Votre prenom"
            value={user.userprenom}
          />
          <div className="phone-input">
            <label htmlFor="userphone">+243</label>
            <input
              autoComplete="off"
              type="number"
              name="userphone"
              placeholder="Votre telephone"
              onChange={handleChange}
              onKeyPress={handlePhone}
              value={user.userphone}
            />
          </div>
          <button className="btn-add-user" onClick={editUser} id="btn-ajout">
            MODIFIER
          </button>
        </div>
      )}
    </div>
  );
}
export default PageUserEdit;
