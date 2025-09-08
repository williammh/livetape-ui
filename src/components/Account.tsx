import { Avatar, colors, Grid, Typography } from '@mui/material'
import { Item } from '../App'
import { Orders } from './Orders'
import { Positions } from './Positions'
import { ProfitLoss } from './ProfitLoss'
import moo from '../assets/moo.png';
import grizz from '../assets/grizz.png';

export const Account = ({persona}: {persona: string}) => {



    return (
        <Item
            sx={{
                height: '100%',
                minHeight: 430,
                // overflow: 'scroll',
            }}
        >
            <Grid
                container
                direction='row'
                columns={2}
                spacing={1}
              
            >
            <Grid
                container
                direction='row'
                alignItems='center'
                size={2}
                textAlign='left'
            >
                <Grid
      
                >
                    <Avatar
                        src={persona === 'moo' ? moo : grizz}
                        sx={{
                            height: 56,
                            width: 56,
                            bgcolor: persona === 'moo' ? colors.green[400] : colors.red[400],
                            margin: 'auto',
                            display: 'inline-block'
                        }}
                    />
                </Grid>
                <Grid
                    flexGrow={1}
                >
                    <Typography
                        variant='h6'
                        component={'span'}
                        sx={{
                            fontWeight: 'bold',
                            // paddingLeft: 1,
                            display: 'inline-block'
                        }}
                    >
                        {`${persona[0].toUpperCase()}${persona.slice(1)}`}
                    </Typography>
                </Grid>
            </Grid>
            <Grid
                size={1}
            >
                <ProfitLoss persona={persona} />
            </Grid>
            <Grid
                size={1}
            >
                <Positions persona={persona} />
            </Grid>
            </Grid>
            <Grid
            size={2}
            >
            <Orders persona={persona} />
            </Grid>
        </Item>
    )
}