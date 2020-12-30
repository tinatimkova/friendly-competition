import { useState, useEffect } from "react";
import { postSubmission } from "../../../services/submissions";
import { Button, TextField } from "@material-ui/core";
import Div from "./styledSubmissionCreate";

function SubmissionCreate({ currentUser, setAllSubmissions, contest, isSubmitted }) {
  const [isCreated, setCreated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    const newSubmission = await postSubmission(formData, {
      user_id: currentUser.id,
      contest_id: contest.id,
    });
    setAllSubmissions((prevState) => [...prevState, newSubmission]);
  };



  const [formData, setFormData] = useState({
    name: "",
    content: "",
    file: "",
  });
  const { name, content, file } = formData;



  const onFileSelected = (e) => {
    const img = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      setFormData({
        ...formData,
        file: fileReader.result,
      });
    });
    if (img) {
      fileReader.readAsDataURL(img);
    }
  };

  const selectFile = () => {
    document.getElementById("file-upload").click();
  };

  const handleFileClear = () => {
    setFormData({
      ...formData,
      file: "",
    });
    document.getElementById("file-upload").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSubmission = await postSubmission({
      name: formData.name,
      content: formData.content,
      file: formData.file,
      user_id: currentUser.id,
      contest_id: contest.id,
    });
    setAllSubmissions((prevState) => [...prevState, newSubmission]);
    setCreated({ newSubmission });
  };

  if (isCreated || isSubmitted) {
    return (<Div>Cheers! <br /> Your Entry is in!</Div>)
  }

  return (
    <Div>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Entry Name"
            name="name"
            source="id"
            variant="filled"
            value={name}
            onChange={handleChange}
          />
        </div>
        <div>
          <TextField
            label="Entry Text"
            name="content"
            variant="filled"
            source="id"
            multiline
            className="content-input"
            rows={8}
            value={content}
            onChange={handleChange}
          />
        </div>
        <Button variant="contained" onClick={selectFile}>Upload Image</Button>
        <Button variant="contained" disabled={!currentUser} type="submit">{currentUser ? <>Enter Contest</> : <>Please Log-In</>}</Button>
      </form>
      <input
        type="file"
        id="file-upload"
        style={{ visibility: "hidden" }}
        onChange={onFileSelected}
      />
    </Div>
  );
}

export default SubmissionCreate;
