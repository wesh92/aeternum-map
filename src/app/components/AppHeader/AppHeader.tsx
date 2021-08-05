import { classNames } from '../../utils/styles';
import {
  closeMainWindow,
  dragMoveWindow,
  minimizeWindow,
} from '../../utils/windows';
import classes from './AppHeader.module.css';

type AppHeaderProps = {
  className?: string;
};

function AppHeader({ className }: AppHeaderProps): JSX.Element {
  return (
    <header className={classNames(classes.header, className)}>
      <h1 className={classes.title} onMouseDown={dragMoveWindow}>
        New World Companion
      </h1>
      <button className={classes.button} onClick={minimizeWindow}>
        <svg viewBox="0 0 10 10" stroke="currentColor">
          <line x1="0" y1="9" x2="10" y2="9" />
        </svg>
      </button>
      <button
        className={`${classes.button} ${classes['button--danger']}`}
        onClick={closeMainWindow}
      >
        <svg viewBox="0 0 10 10" stroke="currentColor">
          <line x1="0" y1="0" x2="10" y2="10" />
          <line x1="10" y1="0" x2="0" y2="10" />
        </svg>
      </button>
    </header>
  );
}

export default AppHeader;