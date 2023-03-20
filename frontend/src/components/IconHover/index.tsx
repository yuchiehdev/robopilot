import './iconHover.scss';
import React, { useState } from 'react';
import Classnames from 'classnames';

const IconHover = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  let timer: any = 0;
  const TIMEOUT = 300;
  const classes = Classnames({
    icon: true,
    visible: tooltipVisible,
  });

  function mouseEnter() {
    timer = setTimeout(() => {
      setTooltipVisible(true);
    }, TIMEOUT);
  }

  function mouseLeave() {
    setTooltipVisible(false);
    clearTimeout(timer);
  }
  return (
    <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} className={classes}>
      🤙
      <span className="tooltip">Hang Loose</span>
    </div>
  );
};

export default IconHover;
