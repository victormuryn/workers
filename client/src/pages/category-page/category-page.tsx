import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../../utils/api';

import './category-page.scss';

import Container from 'react-bootstrap/Container';
import {setPageMeta} from '../../utils/utils';
import {State} from '../../redux/reducer';
import {useSelector} from 'react-redux';

type Category = {
  _id: string,
  url: string,
  title: string,
}

const CategoryPage: React.FC = () => {
  const {name} = useParams<{name: string}>();
  const user = useSelector((state: State) => state.user);

  const [data, setData] = useState<Category>({
    title: ``,
    url: name,
    _id: ``,
  });

  setPageMeta(data.title);

  useEffect(() => {
    api
      .get<Category>(`/categories/${name}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }, []);

  return (
    <Container>
      <p>CategoryPage — {data.title} {data.url}</p>
    </Container>
  );
};

export default CategoryPage;
