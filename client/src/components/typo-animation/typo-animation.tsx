import React, {useEffect, useRef} from 'react';

const DELETE_SPEED: number = 100; // ms
const WRITE_SPEED: number = 130; // ms
const DELAY: number = 10000; // ms

type TypoAnimationProps = {
  phrases: string[],
  elementsClass?: string,
  deleteSpeed?: number,
  writeSpeed?: number,
  delay?: number,
};

const TypoAnimation: React.FC<TypoAnimationProps> = ({
  phrases,
  elementsClass,
  deleteSpeed = DELETE_SPEED,
  writeSpeed = WRITE_SPEED,
  delay = DELAY,
}) => {
  const animElement = useRef<HTMLSpanElement>(null);

  const changePhrase = (element: HTMLSpanElement, phrases: string[]) => {
    const changeActivePhrase = (current: string | null) => {
      if (!current) {
        return phrases[0];
      }

      return phrases[phrases.indexOf(current) + 1] || phrases[0];
    };

    let activePhrase:string = changeActivePhrase(element.textContent);

    const deleteLetters = (afterEnd: () => void): void => {
      const deleteInterval: NodeJS.Timeout = setInterval(() => {
        // new text content = last text content without last character
        element.textContent = element.textContent!.slice(0, -1);

        // if text is empty
        if (!element.textContent) {
          clearInterval(deleteInterval);
          afterEnd();
        }
      }, deleteSpeed);
    };

    const writeLetters = (phrase: string): void => {
      let lettersPrinted: number = 0;

      const writeInterval: NodeJS.Timeout = setInterval(() => {
        // text content = current phrase + one letter
        element.textContent = phrase.slice(0, lettersPrinted);

        if (lettersPrinted === phrase.length) {
          clearInterval(writeInterval);

          // change active phrase: if activePhrase + 1 exists or first in array
          activePhrase = changeActivePhrase(activePhrase);

          setTimeout(() => {
            deleteLetters(() => writeLetters(activePhrase));
          }, delay);
        }

        lettersPrinted++;
      }, writeSpeed);
    };

    deleteLetters(() => writeLetters(activePhrase));
  };

  useEffect(() => {
    if (!animElement || !animElement.current) return;

    changePhrase(animElement.current, phrases);
  }, [animElement]);

  return (
    <span className={elementsClass} ref={animElement}>{phrases[0]}</span>
  );
};

export default TypoAnimation;
