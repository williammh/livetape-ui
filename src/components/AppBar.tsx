import { Grid, Typography } from '@mui/material'
import { Item } from '../App'
import { ServerStatus } from './ServerStatus'

export const AppBar = () => {
    return (
        <Grid
            size={18}
        >
            <Item sx={{height: '100%'}}>
            <Grid
                container
                columns={2}
                alignItems='center'
                sx={{
                    height: '100%'
                }}
            >
                <Grid
                size={1}
                sx={{
                    textAlign: 'left',
                }}
                >
                <Typography
                    variant='h3'
                    component='span'
                    sx={{
                    fontFamily: 'MontserratCustom',
                    paddingLeft: 1,
                    }}
                >
                    LiveTape.ai
                </Typography>
                </Grid>
                
                <Grid
                size={1}
                >
                <ServerStatus />
                </Grid>
                
            </Grid>
            </Item>
        </Grid>
    )
}