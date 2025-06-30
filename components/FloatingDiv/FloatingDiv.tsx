'use client';

import React, {
  ElementType, ReactNode, useEffect, useRef, useState
} from 'react';
import clsx from 'clsx';
import styles from './FloatingDiv.module.scss';

interface FloatingDivProps {
  children: ReactNode;
  containerElm?: ElementType;
  className?: string;
  containerClassName?: string;
}

export default function FloatingDiv({
  children,
  containerElm,
  className,
  containerClassName
}: FloatingDivProps) {
  const [isFloating, setIsFloating] = useState<boolean>(false);
  const [containerHeight, setContainerHeight] = useState<string>('inherit');
  const refContainer = useRef<HTMLElement>(null);

  let finalChildren = children;
  if (React.isValidElement(children) && children.type === 'p') {
    finalChildren = children.props.children;
  }

  function scrollToTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    window.history.pushState({}, document.title, window.location.pathname);
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);

    function onScroll(): void {
      const navElm = refContainer.current;
      if (!navElm) return;

      const { top, height } = navElm.getBoundingClientRect();
      if (!isFloating) {
        if (top < 0) {
          setIsFloating(true);
          setContainerHeight(`${height}px`);
        }
      } else if (isFloating) {
        if (top >= 0) {
          setIsFloating(false);
          setContainerHeight('inherit');
        }
      }
    }
  }, [isFloating]); // Added isFloating as a dependency since it's used in onScroll

  const Container: ElementType = containerElm || 'div';

  return (
    <Container
      className={containerClassName}
      style={{ height: containerHeight }}
      ref={refContainer}
    >
      <div
        className={clsx({ [styles.floatingDiv]: isFloating }, className)}
      >
        {finalChildren}
      </div>
      <div
        className={clsx(
          styles.bottomText,
          !isFloating && styles.bottomTextHidden
        )}
        onClick={scrollToTop}
      >
        Back to top
      </div>
    </Container>
  );
}
