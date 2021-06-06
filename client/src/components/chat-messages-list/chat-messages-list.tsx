import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import './chat-messages-list.scss';

import ChatMessage from '../chat-message';

import {State} from '../../redux/reducer';
import {MessageUser} from '../../redux/messages/types';
import {last} from '../../utils/utils';
import {ActionCreator} from '../../redux/action-creator';

interface Props {
  selectedUser: MessageUser | null,
}

const ChatMessagesList: React.FC<Props> = ({selectedUser}) => {
  const chatContainer = useRef<HTMLUListElement>(null);
  const dispatch = useDispatch();

  const currentUser = useSelector((state: State) => ({
    name: state.user.name,
    image: state.user.image,
    username: state.user.username,
  }));

  const [scroll, setScroll] = useState<number>(0);

  const {
    name = ``,
    more = false,
    username = ``,
    image = false,
    messages = [],
    userID = ``,
    moreSent = false,
  } = selectedUser || {};

  const hour = 1000 * 60 * 60;
  const lastMessage = last(selectedUser?.messages || []);

  const doWithoutSmooth = (element: HTMLElement | null, cb: () => any) => {
    if (!element) return;

    element.style.scrollBehavior = `auto`;
    cb();
    element.style.scrollBehavior = `smooth`;
  };

  const scrollMessages = (check = true) => {
    if (chatContainer && chatContainer.current) {
      const {current} = chatContainer;
      const {scrollHeight, clientHeight, scrollTop} = current;

      if (!check || scrollHeight - 2 * clientHeight < scrollTop) {
        const scroll = scrollHeight - clientHeight;
        chatContainer.current.scrollTo(0, scroll);
      }
    }
  };

  const onScroll = (event: Event) => {
    event.preventDefault();
    const target = event.target as HTMLUListElement;
    const {scrollTop, scrollHeight} = target;

    setScroll(scrollHeight - scrollTop);

    if (scrollTop < 500 && !moreSent && more) {
      dispatch(ActionCreator.getOlderMessages(userID, messages.length));
    }
  };

  useEffect(() => {
    if (chatContainer && chatContainer.current) {
      doWithoutSmooth(chatContainer.current, () => {
        const {current} = chatContainer;
        current?.scrollTo(0, current!.scrollHeight - scroll);
      });
    }
  }, [selectedUser?.messages[0]]);

  useEffect(() => {
    doWithoutSmooth(chatContainer.current, () => {
      scrollMessages(false);
    });

    return () => {
      chatContainer.current?.removeEventListener(`scroll`, onScroll);
    };
  }, [userID]);

  useEffect(() => {
    scrollMessages();
  }, [
    lastMessage?.read,
    lastMessage?._id,
  ]);

  useEffect(() => {
    if (userID && more && !moreSent) {
      chatContainer.current?.addEventListener(`scroll`, onScroll);
    } else {
      chatContainer.current?.removeEventListener(`scroll`, onScroll);
    }

    return () => {
      chatContainer.current?.removeEventListener(`scroll`, onScroll);
    };
  }, [userID, more, moreSent]);

  return (
    <ul
      ref={chatContainer}
      className="chat-box chatContainerScroll"
    >
      {
        messages.map((message, i, messages) => {
          const {_id, content, fromSelf, date, from} = message;
          const msgDate = new Date(date);
          const prev = i > 0 ? messages[i - 1].date : 0;

          const longAgo = (+msgDate - +new Date(prev)) > hour;

          const next = messages[i + 1];
          const showAvatar = next?.from !== from ||
            +new Date(next?.date) - +msgDate > hour;

          const msg = {
            content,
            fromSelf,
            showAvatar,
            date: msgDate,
            name: fromSelf ? currentUser.name : name,
            image: fromSelf ? currentUser.image : image,
            username: fromSelf ? currentUser.username : username,
          };

          return (
            <>
              {
                longAgo &&
                  <li
                    key={`${_id}-separator`}
                    className="text-muted text-center my-5"
                  >
                    ~~ {msg.date.toLocaleString()} ~~
                  </li>
              }

              <ChatMessage key={_id} message={msg} />
            </>
          );
        })
      }

      {
        (lastMessage?.read && lastMessage?.fromSelf) &&
          <li className="text-center text-secondary mb-4">Прочитано</li>
      }
    </ul>
  );
};

export default ChatMessagesList;
