import React, {useEffect, useState} from 'react';

import {useHttp} from '../../hooks/http.hook';

import './projects-page.scss';

import Container from 'react-bootstrap/Container';
import ProjectItem from '../../components/project-item/project-item';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const {request} = useHttp();

  useEffect(async () => {
    const response = await request(`/api/project/`);
    setProjects(response);
  }, []);

  return (
    <>
      <h1 className="text-center mt-5 pt-3">Усі проєкти</h1>

      <Container as="ul" className="projects__list">
        {projects.length ?
          projects.map((project) => (
            <ProjectItem key={project._id} {...project} />
          )) :
          <h2 className="text-center">Не вдалося знайти жодного проєкту</h2>
        }
      </Container>
    </>
  );
};

export default ProjectsPage;
