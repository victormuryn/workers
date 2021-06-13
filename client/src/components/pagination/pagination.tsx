import React, {useEffect, useState} from 'react';

import './pagination.scss';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BsPagination from 'react-bootstrap/Pagination';

interface Props {
  initialPage?: number,
  maxPage?: number;
  onClick?: (page: number) => void;
}

const MAX_PAGES = 3;

const Pagination: React.FC<Props> = ({
  maxPage = 1,
  initialPage= 1,
  onClick = () => {},
}) => {
  const [page, setPage] = useState<number>(
    maxPage >= initialPage ?
      initialPage :
      1,
  );

  const onPaginationClick = (event: React.MouseEvent<HTMLElement>) => {
    const {textContent} = event.target as HTMLElement;

    if (!textContent) return;

    if (!isNaN(+textContent)) {
      return setPage(+textContent);
    }

    switch (textContent) {
    case `«`:
    case `«First`:
      setPage(1);
      break;

    case `‹`:
    case `‹Previous`:
      setPage((prevState) => prevState >= 2 ? prevState - 1 : 1);
      break;

    case `›`:
    case `›Next`:
      setPage((prevState) => prevState < maxPage ? prevState + 1 : maxPage);
      break;
    }
  };

  useEffect(() => {
    onClick(page);
  }, [onClick, page]);

  const items = [];
  for (let i = -MAX_PAGES; i <= MAX_PAGES; i++) {
    const text = page + i;
    if (text <= 0) continue;
    if (text > maxPage) break;

    items.push(
      <BsPagination.Item
        key={text}
        active={text === page}
        onClick={onPaginationClick}
      >
        {text}
      </BsPagination.Item>,
    );
  }

  if (maxPage > 1) {
    return (
      <Row className="mt-5">
        <Col md={2} />

        <Col md={10} className="d-flex justify-content-center">
          <BsPagination>
            <BsPagination.First onClick={onPaginationClick} />
            <BsPagination.Prev onClick={onPaginationClick} />

            {items}

            <BsPagination.Next onClick={onPaginationClick} />
          </BsPagination>
        </Col>
      </Row>
    );
  }

  return null;
};

export default Pagination;
