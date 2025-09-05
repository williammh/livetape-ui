import { Grid, Typography } from '@mui/material'
import { Item } from '../App'
import { Orders } from './Orders'
import { Positions } from './Positions'
import { ProfitLoss } from './ProfitLoss'
export const Account = ({persona}: {persona: string}) => {


    return (
        <Item
            sx={{
            height: '100%'
        }}>
            <Grid
                container
                direction='row'
                columns={2}
                spacing={1}
            >
            <Grid
                size={2}
                textAlign='left'
            >
                <Typography
                variant='h6'
                sx={{
                    fontWeight: 'bold',
                    paddingLeft: 1
                }}
                >
                    {`${persona[0].toUpperCase()}${persona.slice(1)}`}
                </Typography>
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