import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function Success({ result, setResult = () => {}, classes }) {
  return (
    <Fragment>
      <div className={classes.marginTop3}>
        <Grid container justifyContent="flex-end" className={classes.marginBottom2}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            size="small"
            onClick={() => setResult(null)}
          >
            Back
          </Button>
        </Grid>
        <Alert severity="success" className={classes.marginBottom2}>
          <AlertTitle>Success</AlertTitle>
          {result.to && result.type !== 'ethereal' ? (
            <span>Successfully Email Sent to - <strong>{result.to}</strong></span>
          ) : null}
          {result.type === 'ethereal' ? (
            <div>
              <span>Successfully Email Generator.</span>
              <Button size="small" href={result.url} color="primary" target="_blank">
                Click here to View Mail
              </Button>
            </div>
          ) : null}
        </Alert>
      </div>
    </Fragment>
  );
}
