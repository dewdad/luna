import { defaultFont } from 'styles/variables';

const styles = theme => ({
  root: {
    width: '100%'
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  text: {
    ...defaultFont
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  resetContainer: {
    padding: theme.spacing.unit * 3
  }
});

export default styles;
