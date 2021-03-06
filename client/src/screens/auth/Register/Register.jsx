import { useState } from "react";
import { registerUser } from "../../../services/auth";
import { useStateValue } from "../../../providers/CurrentUserProvider";
import Button from "@material-ui/core/Button";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import FetchUsers from "../../../components/Helpers/FetchAllUsers";
import {
  checkPasswordValidity,
  checkEmailValidity,
  checkEmailUniqueness,
} from "../../../utils/authUtils.js";
// import Wrapper from "./styledRegister";
import CameraIcon from "@material-ui/icons/CameraAlt";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import ClearIcon from "@material-ui/icons/Clear";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { goBack } from "../../../utils/goBack";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import PasswordAlerts from "../../../components/Form/PasswordAlerts";
import Navbar from '../../../layout/Navbar/Navbar'
import './Register.css'

function Register() {
  const [, dispatch] = useStateValue();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [emailValidityAlert, setEmailValidityAlert] = useState(false);
  const [emailUniquenessAlert, setEmailUniquenessAlert] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);
  const [passwordHasNumber, setPasswordHasNumber] = useState(false);
  const [passwordHasLowerCase, setPasswordHasLowerCase] = useState(false);
  const [passwordHasUpperCase, setPasswordHasUpperCase] = useState(false);
  const [
    passwordHasSpecialCharacter,
    setPasswordHasSpecialCharacter,
  ] = useState(false);

  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    image: "",
  });
  const { first_name, last_name, email, password, image } = formData;

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleShowPasswordConfirm = () => {
    setShowPasswordConfirm((prevState) => !prevState);
  };

  const onImageSelected = (e) => {
    // the image result is equal to event.target.files of index 0, the reason why I'm doing [0] is because:
    // a user should only be able to upload 1 image at a time as his profile pic, and not multiple, files is an array.
    const img = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      setFormData({
        ...formData,
        image: fileReader.result,
      });
    });
    // if we have an uploaded image, aka if we have "img", read the image as data url (readAsDataURL is a built in function)
    if (img) {
      fileReader.readAsDataURL(img);
    }
  };

  const selectImage = () => {
    document.getElementById("image-upload").click();
  };

  const handleImageClear = () => {
    setFormData({
      ...formData,
      image: "",
    });
    document.getElementById("image-upload").value = "";
  };

  const handleFormValidity = () => {
    // all these checks are imported from authUtils.js in services folder.
    checkEmailValidity(email, setEmailValidityAlert);
    checkEmailUniqueness(allUsers, email, setEmailUniquenessAlert);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // it takes a while for the setFormData to be updated, so we have this if condition
    if (name === "password") {
      // value is password

      // checkpasswordValidity is imported from src/services/authUtils to save space.
      checkPasswordValidity(
        value,
        setPasswordHasLowerCase,
        setPasswordHasUpperCase,
        setPasswordLengthValid,
        setPasswordHasNumber,
        setPasswordHasSpecialCharacter
      );
    }
  };

  const handleRegister = async (registerData) => {
    const userData = await registerUser(registerData);
    dispatch({ type: "SET_USER", currentUser: userData });
    history.push("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFormValidity();
    if (
      !emailValidityAlert &&
      !emailUniquenessAlert &&
      password === passwordConfirm &&
      passwordHasLowerCase &&
      passwordHasUpperCase &&
      passwordHasSpecialCharacter &&
      passwordHasNumber &&
      first_name
    ) {
      handleRegister(formData);
    } else {
      return;
    }
    // if the conditions for the password are true.
    // and the email is valid and unique.
    // and we have a name, go ahead and register, else: do nothing.
  };

  return (
    <>
      <Navbar />
      <FetchUsers setAllUsers={setAllUsers} />
      <div className="arrow-container">
        <IconButton className="arrow-icon" onClick={goBack}>
          <ArrowBackOutlinedIcon className="arrow-icon" />
        </IconButton>
      </div>

      <div className="inner-column-register">
        <div className="title-container">
          <h1>SIGN UP TO CHALLENGE.ME</h1>
        </div>
        <div className="user-image-container">
          {image ? (
            <img className="big-user-image" src={image} alt={first_name} />
          ) : (
              <AccountCircleIcon className="big-icon" />
            )}
          <footer className="picture-buttons">
            {/* if we have an uploaded image show the image clear icon */}
            {image && (
              <IconButton
                onMouseDown={(e) => e.preventDefault()}
                className="icon-button clear"
                onClick={handleImageClear}
              >
                <ClearIcon className="big-camera-icon" />
              </IconButton>
            )}

            <IconButton
              onMouseDown={(e) => e.preventDefault()}
              className="icon-button"
              onClick={selectImage}
            >
              {image ? (
                <CameraIcon className="big-camera-icon" />
              ) : (
                  <AddAPhotoIcon style={{ color: '#000000' }} className="big-camera-icon" />
                )}
            </IconButton>
          </footer>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FormControl>
              <InputLabel htmlFor="first_name">First Name</InputLabel>

              <Input
                required
                type="text"
                value={first_name}
                name="first_name"
                onChange={handleChange}
              />
            </FormControl>
          </div>

          <div className="input-container">
            <FormControl>
              <InputLabel htmlFor="last_name">Last Name</InputLabel>
              <Input
                type="text"
                value={last_name}
                name="last_name"
                onChange={handleChange}
              />
            </FormControl>
          </div>

          <div className="input-container">
            <FormControl>
              <InputLabel htmlFor="Email">Email Address</InputLabel>
              <Input
                required
                type="email"
                value={email}
                name="email"
                onChange={handleChange}
              />
            </FormControl>
          </div>
          {emailValidityAlert && (
            <>
              <div className="alert">
                <p>Please enter a valid email address</p>
              </div>
            </>
          )}
          {emailUniquenessAlert && (
            <>
              <div className="alert">
                <p>This email address already exists!</p>
              </div>
            </>
          )}
          <div className="input-container">
            <FormControl>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>

          <div className="input-container">
            <FormControl>
              <InputLabel htmlFor="password-confirm">
                Confirm Password
              </InputLabel>
              <Input
                required
                type={showPasswordConfirm ? "text" : "password"}
                name="password-confirm"
                onChange={(e) => setPasswordConfirm(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPasswordConfirm}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
          <br />
          {/* separating the password alerts div to a separate file to save space */}
          <PasswordAlerts
            password={password}
            passwordConfirm={passwordConfirm}
            passwordHasNumber={passwordHasNumber}
            passwordHasSpecialCharacter={passwordHasSpecialCharacter}
            passwordHasUpperCase={passwordHasUpperCase}
            passwordHasLowerCase={passwordHasLowerCase}
            passwordLengthValid={passwordLengthValid}
          />
          <input
            type="file"
            id="image-upload"
            style={{ visibility: "hidden" }}
            onChange={onImageSelected}
          />
          <Button disabled={password !== passwordConfirm ||
            !passwordHasLowerCase ||
            !passwordHasUpperCase ||
            !passwordHasSpecialCharacter ||
            !passwordHasNumber ||
            !first_name} className='button-container' variant="contained" type="submit">
            Get Started
          </Button>
        </form>
      </div>
    </>
  );
}
export default Register;