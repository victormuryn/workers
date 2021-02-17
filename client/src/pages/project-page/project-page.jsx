import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useHttp} from '../../hooks/http.hook';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ProjectPage = () => {
  const [project, setProject] = useState({});
  const [author, setAuthor] = useState({});
  const {id} = useParams();

  const {request: projectRequest} = useHttp();
  const {request: authorRequest} = useHttp();

  useEffect(async () => {
    const response = await projectRequest(`/api/project/${id}`);
    setProject(response);
    console.log(response.author);

    const authorResponse = await authorRequest(`/api/user/${response.author}`);
    setAuthor(authorResponse);
    console.log(authorResponse);
  }, []);

  return (
    <Container>
      <Row>
        <Col lg={8}>
          <h1>{project.title}</h1>
          <p dangerouslySetInnerHTML={{__html: project.description}} />
          <p>{author.name} {author.surname}</p>
        </Col>

        <Col lg={4}>
          sidebar
        </Col>
      </Row>
    </Container>
  );
};


export default ProjectPage;
