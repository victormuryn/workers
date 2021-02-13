import React, {useState} from 'react';
import './create-page.scss';

import {Editor} from '@tinymce/tinymce-react';
import 'draft-js/dist/Draft.css';

const CreatePage = () => {
  const handleEditorChange = (e) => {
    console.log(
      'Content was updated:',
      e.target.getContent(),
    );
  };

  return (
    <>
      <div className="container">
        <Editor
          apiKey="v0lbfhsjceqco2uno33wpn9tv3kxse1fxs7vot8peelq7ol3"
          onChange={handleEditorChange}
          init={{
            height: 500,
            menubar: false,
            plugins: [`lists link`],
            language: 'uk',
            toolbar:
              `undo redo | formatselect | bold italic link |
              alignleft aligncenter |
              bullist numlist outdent indent`,
          }}
        />
      </div>
    </>
  );
};

export default CreatePage;
