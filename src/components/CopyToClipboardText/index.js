import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import {useCopyToClipboard} from "react-use";
import Tooltip from '@material-ui/core/Tooltip';
import {useCallback, useState} from "react";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    cursor: "pointer",
  },
  icon: {
    marginRight: "5px",
    marginBottom: "2px",
  }
}));

const STATUS_COPY = {
    COPY: "copy",
    COPIED: "copied",
}

const TITLE_BY_STATUS = {
  [STATUS_COPY.COPY]: "Copy",
  [STATUS_COPY.COPIED]: "Copied",
}

export const CopyToClipboardText = ({ text }) => {
  const classes = useStyles();
  const [, copyToClipboard] = useCopyToClipboard();
  const [statusCopy, setStatusCopy] = useState(STATUS_COPY.COPY);

  const onClickCopy = useCallback(() => {
    copyToClipboard(text);
    setStatusCopy(STATUS_COPY.COPIED);
  }, [copyToClipboard, text]);

  const handleTooltipClose = useCallback(() => {
    setStatusCopy(STATUS_COPY.COPY);
  }, [setStatusCopy]);

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        title={TITLE_BY_STATUS[statusCopy]}
        placement="top"
        arrow
      >
        <Button
          className={classes.root}
          onClick={onClickCopy}
        >
          <FileCopyOutlinedIcon
            fontSize="small"
            className={classes.icon}
          />
          {text}
        </Button>
      </Tooltip>
    </ClickAwayListener>
  );
};

CopyToClipboardText.propTypes = {
  text: PropTypes.string.isRequired
}
