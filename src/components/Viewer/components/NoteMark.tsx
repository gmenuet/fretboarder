import Box, { BoxProps } from '@mui/material/Box';
import { Interval, colorsOfHTI } from 'src/config/modes';

import { FC } from 'react';
import { Note } from 'src/config/notes';
import clsx from 'clsx';
import { grey } from '@mui/material/colors';
import { useAppContext } from 'src/contexts/appContext';

type Props = BoxProps &
  WithSx & {
    note: Note;
    interval?: Interval;
    variant?: 'default' | 'tonic';
    emptyString?: boolean;
  };

export const noteSize = 25;

const NoteMark: FC<Props> = ({
  className,
  sx: sxProp,
  emptyString,
  variant,
  note,
  interval,
}) => {
  const { displayMode } = useAppContext();
  const hasHash = /#/.test(note);
  const baseNote = note.replace(/#/g, '');

  const renderValue = () => {
    if (displayMode === 'interval') {
      return interval;
    }

    return (
      <>
        {baseNote}
        {hasHash && <sup>♯</sup>}
      </>
    );
  };

  const color = () => {
    if (displayMode === 'interval') {
      return interval ? colorsOfHTI[interval] : 'transparent';
    }
    return interval ? colorsOfHTI[interval] : grey[800];
  };

  const isTonic = interval === 'T';

  return (
    <Box
      sx={{
        boxShadow: 2,
        display: 'inline-flex',
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: noteSize,
        height: noteSize,
        overflow: 'hidden',
        borderRadius: '50%',
        fontFamily: "'Instagram Sans Condensed', sans-serif",
        fontSize: '0.9em',
        fontWeight: 600,
        '& sup': {
          fontSize: '0.6em',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(25%, -45%)',
        },
        color: `secondary.contrastText`,
        bgcolor: color,
        '&.isTonic': {
          border: `2px solid`,
          borderColor: isTonic ? `secondary.contrastText` : color,
        },
        '&.emptyString': {
          color: color,
          bgcolor: `transparent`,
          border: `2px solid`,
          borderColor: color,
          '&.isTonic': {
            color: `secondary.contrastText`,
            borderColor: isTonic ? `secondary.contrastText` : color,
          },
        },
        ...sxProp,
      }}
      className={clsx(className, { emptyString, isTonic })}
    >
      {renderValue()}
    </Box>
  );
};

export default NoteMark;
