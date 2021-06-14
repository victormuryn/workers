import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../../utils/api';

import './projects-page.scss';

import Pagination from '../../components/pagination';
import ProjectItem from '../../components/project-item';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import {State} from '../../redux/reducer';
import {addToSearch, setPageMeta} from '../../utils/utils';
import {Project} from '../../types/types';
import {useHistory} from 'react-router-dom';
import SearchFilter from '../../components/search-filter';
import Message from '../../components/message';

interface Form {
  categories: string[],
  location: [],
  remote: boolean,
  hot: boolean,
}

interface ProjectsResponse {
  projects: Project[]
  pages: number
}

const ProjectsPage: React.FC = () => {
  setPageMeta(`Усі проєкти`);

  const history = useHistory();

  const query = new URLSearchParams(location.search);
  const urlPage = query.get(`page`);
  const urlPageNumber = (urlPage && !isNaN(+urlPage)) ? +urlPage : 1;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(``);
  const [projects, setProjects] = useState<Project[]>([]);
  const [maxPage, setMaxPage] = useState<number>(Infinity);
  const [page, setPage] = useState<number>(urlPageNumber);
  const [search, setSearch] = useState<string>(``);

  const token = useSelector((state: State) => state.user.token);

  const onFilterSubmit = (form: Form) => {
    const stringifiedForm = JSON.stringify(form);

    localStorage.setItem(`searchFilter`, stringifiedForm);
    setPage(1);
    setSearch(addToSearch({...form}));
  };

  const onPageChange = (page: number) => {
    setSearch(addToSearch({
      // not to show first page at url
      page: page === 1 ? false : page,
    }));
  };

  useEffect(() => {
    const stringifiedForm = localStorage.getItem(`searchFilter`);

    if (stringifiedForm) {
      try {
        const form = JSON.parse(stringifiedForm) as Form;
        setSearch(addToSearch(form));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    history.push({search});
    setLoading(true);

    api
      .get<ProjectsResponse>(`/project${search}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      .then((response) => {
        const {projects, pages} = response.data;
        setProjects(projects);

        if (pages !== maxPage) {
          setMaxPage(pages);
        }
      })
      .catch(({response}) => {
        setError(response.data.message ||
          `Щось пішло не так, спробуйте знову.`);
      })
      .then(() => setLoading(false));
  }, [search]);

  return (
    <>
      <h1 className="text-center mt-5 pt-3">Усі проєкти</h1>

      {
        error && <Message
          text={error}
          type="danger"
          onClose={() => setError(``)}
        />
      }

      <Container className="mt-5">
        <Row>
          <Col md={3} className="order-1 order-md-0 mt-4 mt-md-0">
            <SearchFilter onSubmit={onFilterSubmit} />
          </Col>

          <Col md={9} as="ul" className="projects__list">
            {
              loading ?
                <Message text={`loading`} /> :
                projects.length ?
                  projects.map((project) => (
                    <ProjectItem key={project._id} {...project} />
                  )) :
                  <h2 className="text-center">
                    Не вдалося знайти жодного проєкту
                  </h2>
            }
          </Col>
        </Row>

        <Pagination
          maxPage={maxPage}
          initialPage={page}
          onClick={onPageChange}
        />
      </Container>
    </>
  );
};

export default ProjectsPage;
