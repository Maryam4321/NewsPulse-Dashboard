import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
export default function StockQuoteFigure({ label, value }) {
    return (
        <Grid item xs={12} lg={6} xl={4} className='flex' >
            <Typography variant='h6' component='h3' className='font-light' >{label}: </Typography>
            <Typography variant='h6' component='h3' className='ml-auto font-semibold ' color='primary'>{value}</Typography>
        </Grid>
    )
}