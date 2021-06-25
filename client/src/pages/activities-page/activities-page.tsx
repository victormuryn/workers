import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';

import api from '../../utils/api';

import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';

import './activities-page.scss';

import Pagination from '../../components/pagination';
import ProjectItem from '../../components/project-item';


import {State} from '../../redux/reducer';
import {
  addToSearch,
  formatPrice,
  getPluralNoun,
  setPageMeta,
} from '../../utils/utils';


interface DataClient {
  type: `client`,
  maxPage: number,
  data: {
    _id: string,
    price?: number,
    title: string,
    hot: boolean,
    bets: string[],
    date: string,
    description: string,
    category: {
      _id: string,
      title: string
    }[],
    remote: boolean,
    location: {
      city: string,
      region: string
    },
  }[],
}

interface DataFreelancer {
  type: `freelancer`,
  maxPage: number,
  data: {
    _id: string,
    date: string,
    project: {
      _id: string,
      price?: number,
      title: string,
      hot: boolean,
      description: string,
      category: {
        _id: string,
        title: string
      }[],
      remote: boolean,
      location: {
        city: string,
        region: string
      },
    },
    term: number,
    price: number,
  }[]
}

type Data = DataClient | DataFreelancer;

const ActivitiesPage: React.FC = () => {
  const user = useSelector((state: State) => state.user);
  const history = useHistory();

  const query = new URLSearchParams(location.search);
  const urlPage = query.get(`page`);
  const initPage = (urlPage && !isNaN(+urlPage)) ? +urlPage : 1;

  const [search, setSearch] = useState<string>(addToSearch({page: initPage}));
  const [data, setData] = useState<Data>({
    type: `freelancer`,
    data: [],
    maxPage: Infinity,
  });

  const title = `Мої ${user.accountType === `client` ? `проєкти` : `ставки`}`;
  setPageMeta(title);

  const onPageChange = (page: number) => {
    setSearch(addToSearch({
      // don't show first page at url
      page: page === 1 ? false : page,
    }));
  };

  useEffect(() => {
    history.push({search});

    api
      .get<Data>(`/user/activities${search}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      })
      .then(({data}) => setData(data));
  }, [search, user.token]);

  return (
    <Container>
      <h1 className="text-center my-5 py-3">{title}</h1>

      <ul className="projects__list">
        {
          data.type === `freelancer` ?
            data.data.map(({project, price, term, _id, date}) => (
              <ProjectItem
                key={_id}
                date={date}
                _id={project._id}
                hot={project.hot}
                price={project.price}
                title={project.title}
                remote={project.remote}
                location={project.location}
                category={project.category}
                description={project.description}
              />
            )) :
            data.data.map((project, i) => (
              <ProjectItem
                _id={project._id}
                key={project._id}
                hot={project.hot}
                date={project.date}
                price={project.price}
                title={project.title}
                remote={project.remote}
                location={project.location}
                category={project.category}
                description={project.description}
              />
            ))
        }
      </ul>

      <Pagination
        maxPage={data.maxPage}
        onClick={onPageChange}
        initialPage={initPage}
      />
    </Container>
  );
};

export default ActivitiesPage;
