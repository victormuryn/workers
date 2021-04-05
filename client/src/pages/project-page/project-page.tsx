import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import './project-page.scss';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import Loader from '../../components/loader';
import ProjectAddBet from '../../components/project-add-bet';
import ProjectContent from '../../components/project-content';
import ProjectSidebar from '../../components/project-sidebar';
import ProjectBetsList from '../../components/project-bets-list';

import {ActionCreator} from '../../redux/action-creator';
import {State} from '../../redux/reducer';
import {useForm} from '../../hooks/form.hook';
import {setPageMeta} from '../../utils/utils';

type FormState = {
  text: string,
  price: number,
  term: number,
}

const ProjectPage: React.FC = () => {
  const {id} = useParams<{id: string}>(); // project id from url

  const dispatch = useDispatch();
  const {user, project: projectData} = useSelector((state: State) => state);
  const {project, author, bets, error, loading, category} = projectData;

  setPageMeta(project.title);

  const now = new Date();

  // is form showing
  const {form, inputChangeHandler} = useForm<FormState>({
    text: ``,
    price: 0,
    term: 0,
  });

  const isExpired = (new Date(project.expire).getTime() - now.getTime()) < 0;

  let possibleToBet = user.accountType === `freelancer`;
  if (possibleToBet) {
    for (let i = 0; i < bets.length; i++) {
      if (bets[i].author === user.userId) {
        possibleToBet = false;
        break;
      }
    }
  }

  const getProjectData = async () => {
    await dispatch(ActionCreator.getProject(id, user.token));
  };

  // get project data on component mount
  useEffect(() => {
    (async () => {
      getProjectData();
    })();
  }, [id]);

  // on bet form submit
  const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const betData = {
      term: +form.term,
      price: +form.price,
      project: project._id,
      token: user.token || ``,
      author: user.userId || ``,
      text: form.text.replace(/(<([^>]+)>)/gi, ``),
    };

    await dispatch(ActionCreator.postBet(betData));

    // get updated data when bet was sent
    getProjectData();
  };

  const deleteClickHandler = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();

    await dispatch(ActionCreator.deleteBet(id, user.token || ``));
  };

  // there is still no data => show "loader"
  if (loading) {
    return <Loader />;
  }

  if (error) {
    alert(error);
  }

  return (
    <Container className="pt-5">
      <Row>
        <Col lg={8}>
          <ProjectContent
            hot={project.hot}
            category={category}
            title={project.title}
            price={project.price}
            isExpired={isExpired}
            remote={project.remote}
            location={project.location}
            description={project.description}
          />

          {
            possibleToBet && !isExpired ?
              <ProjectAddBet
                onFormSubmit={formSubmitHandler}
                inputChangeHandler={inputChangeHandler}
                price={project.price}
              /> :
              null
          }

          <ProjectBetsList
            bets={bets}
            deleteClickHandler={deleteClickHandler}
          />
        </Col>

        <ProjectSidebar
          // category={category}
          name={author.name}
          date={project.date}
          image={author.image}
          isExpired={isExpired}
          views={project.views}
          expire={project.expire}
          surname={author.surname}
          username={author.username}
          location={author.location}
        />
      </Row>
    </Container>
  );
};


export default ProjectPage;
