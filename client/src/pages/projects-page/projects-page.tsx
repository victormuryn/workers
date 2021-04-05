import React, {useEffect, useState} from 'react';
import api from '../../utils/api';

import './projects-page.scss';

import Loader from '../../components/loader';
import ProjectItem from '../../components/project-item';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useSelector} from 'react-redux';
import {State} from '../../redux/reducer';
import {setPageMeta} from '../../utils/utils';

type Project = {
  _id: string,
  hot: boolean,
  date: string,
  bets: number,
  price: number,
  title: string,
  remote: boolean,
  location: {
    city: string,
    region: string,
    latitude: number,
    longitude: number,
  },
  category: {
    title: string,
    url: string,
  }
}

const ProjectsPage: React.FC = () => {
  setPageMeta(`Усі проєкти`);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);
  const [projects, setProjects] = useState<Project[]>([]);

  const token = useSelector((state: State) => state.user.token);

  useEffect(() => {
    (async () => {
      setLoading(true);

      api
        .get<Project[]>(`/project/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => setProjects(response.data))
        .catch((error) => {
          setError(error.response.data.message ||
            `Щось пішло не так, спробуйте знову.`);
        })
        .then(() => setLoading(false));
    })();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    alert(error);
  }

  return (
    <>
      <h1 className="text-center mt-5 pt-3">Усі проєкти</h1>

      <Container as="ul" className="projects__list">
        <Row>
          <Col md={2}>Settings</Col>

          <Col md={10}>
            {projects.length ?
              projects.map((project) => (
                <ProjectItem key={project._id} {...project} />
              )) :
              <h2 className="text-center">Не вдалося знайти жодного проєкту</h2>
            }
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProjectsPage;
