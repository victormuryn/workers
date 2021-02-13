import React, {useState} from 'react';
import {Editor, EditorState} from 'draft-js';
import 'draft-js/dist/Draft.css';

const CreatePage = () => {
  const [data, setData] = useState({
    description: EditorState.createEmpty(),
  });

  const onDescriptionChange = (value) => {
    setData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  return (
    <>
      <Editor editorState={data.description} onChange={onDescriptionChange} />
    </>
  );
};

export default CreatePage;
