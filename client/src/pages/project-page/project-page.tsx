import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useHttp} from '../../hooks/http.hook';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type Project = {
  _id: string,
  author: string,
  date: string,
  description: string,
  expire: string,
  price: number,
  title: string,
  views: string,
}

type Author = {
  _id: string,
  name: string,
  surname: string,
  username: string
}

const ProjectPage: React.FC = () => {
  const [project, setProject] = useState<Project>({
    _id: ``,
    author: ``,
    date: ``,
    description: ``,
    expire: ``,
    price: 0,
    title: ``,
    views: ``,
  });
  const [author, setAuthor] = useState<Author>({
    _id: ``,
    name: ``,
    surname: ``,
    username: ``,
  });
  const {id} = useParams<{id: string}>();

  const {request: projectRequest} = useHttp<Project>();
  const {request: authorRequest} = useHttp<Author>();

  useEffect(() => {
    (async () => {
      const response = await projectRequest(`/api/project/${id}`);
      setProject(response);
      console.log(`DELETE_AFTER_END`, response);

      const authorResponse = await authorRequest(
        `/api/user/${response.author}`,
      );
      setAuthor(authorResponse);
      console.log(`DELETE_AFTER_END`, authorResponse);
    })();
  }, []);

  // there is still no data => show "loader"
  if (!project._id || !author._id) {
    return <div />;
  }


  return (
    <Container>
      <Row>
        <Col lg={8}>
          <h1>{project!.title}</h1>
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
