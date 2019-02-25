import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import styles from './styles';

function getSteps() {
  return ['Package name', 'Version and License', 'Author'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return (
        <TextField id="standard-name" label="Name" value="" margin="normal" />
      );
    case 1:
      return (
        <TextField
          id="standard-name-1"
          label="Version"
          value=""
          margin="normal"
        />
      );
    case 2:
      return (
        <TextField
          id="standard-name-2"
          label="License"
          value=""
          margin="normal"
        />
      );
    default:
      return null;
  }
}

const AppStepper = ({ classes }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography className={classes.text}>
                {getStepContent(index)}
              </Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(activeStep - 1)}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setActiveStep(activeStep + 1)}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? 'Create' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={() => setActiveStep(0)} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
};

export default withStyles(styles)(AppStepper);
