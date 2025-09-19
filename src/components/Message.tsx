import { Grid, Card, Avatar, Typography, colors } from '@mui/material'
import moo from '../assets/moo.png';
import grizz from '../assets/grizz.png';
import { toLocalDateTimeStr } from '../util/misc';
import { useAppContext } from '../contexts/AppContext';

export interface IMessageProps {
  persona: string;
  text: string;
  timestamp: string;
}

export const Message = ({persona, text: message, timestamp}: IMessageProps) => {
  const { timezone } = useAppContext();
  const localTimestamp = toLocalDateTimeStr(timestamp, timezone);
  const bgColor = persona === 'moo' ? colors.green[400] : colors.red[400];
  const capitalized = `${persona?.[0].toUpperCase()}${persona?.slice(1)}`;
  const displayName = capitalized.includes(":") ? capitalized.slice(0, capitalized.indexOf(":") ) : capitalized;
  const avatar = persona?.startsWith('moo') ? moo : grizz;

  const fontSize = 18;

  return (
    <Grid
      container
      columns={8}
      sx={{
        textAlign: 'left',
        marginBottom: 1,
        marginRight: 1,
      }}
    >
      <Card
        sx={{
          padding: 1,
          width: '100%'
        }}
        
      >
        <Grid
          container
          flexDirection={'column'}
          size={8}
        >
          {persona === 'moo' || persona == 'grizz' ? (
            <Grid
              container
              flexDirection={'row'}
              alignItems={'center'}
              

            >
              <Avatar
                src={avatar}
                sx={{
                  height: 56,
                  width: 56,
                  bgcolor: bgColor,

                }}
              />
              <Typography
                sx={{
                  fontSize: fontSize,
                  fontWeight: 'bold',
                  marginLeft: 1,
                }}
              >
                {displayName}
              </Typography>
            </Grid>
          ) : (
            <>
            </>
          )}
         
          <Grid
            padding={1}
            paddingBottom={0}
          >
            <Typography
              sx={{
                fontSize: fontSize,
                marginBottom: 1
              }}
            >
              {message}
            </Typography>
            <Typography
              sx={{
                textAlign: 'right',
                color: 'gray'
              }}
            >
              {localTimestamp}
            </Typography>
          </Grid>
          
        </Grid>
      
      </Card>
    </Grid>  
  );
}