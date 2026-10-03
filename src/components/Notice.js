import { Typography } from '@mui/material';

function Notice() {
    return (
    <Typography variant='body1' sx={{mt: '16px'}}>
      Note: All operations are performed client-side. No data is sent to a server so your data remains private and secure.
      Checkout the <a href="https://github.com/ryanwithawhy/sqlgenerator">github repository</a> if you want to verify or contribute.
    </Typography>

    )
}

export default Notice;
