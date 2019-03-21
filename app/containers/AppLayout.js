import { ipcRenderer } from 'electron';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMappedState, useDispatch } from 'redux-react-hook';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import { INFO_MESSAGES } from 'constants/AppConstants';
import CssBaseline from '@material-ui/core/CssBaseline';
import Snackbar from '@material-ui/core/Snackbar';
import theme from 'styles/theme';

import SnackbarContent from 'components/common/SnackbarContent';
import Navigator from 'components/layout/Navigator';
import Header from 'components/layout/AppHeader';
import { Packages } from 'components/pages/packages';
import { Notifications } from 'components/pages/notifications';

import { addActionError, removePackages } from 'models/packages/actions';
import { setSnackbar, toggleLoader } from 'models/ui/actions';
import { switchcase, shrinkDirectory } from 'commons/utils';

import { drawerWidth } from 'styles/variables';
import styles from './styles/appLayout';

const mapState = ({
  common: {
    mode,
    directory,
    activePage,
    loader: { loading },
    npm: { env },
    snackbarOptions,
    notifications
  },
  modules: {
    data: { packages, packagesOutdated },
    metadata: { lastUpdatedAt },
    project: { name, version, description }
  }
}) => ({
  lastUpdatedAt,
  activePage,
  mode,
  directory,
  packages,
  packagesOutdated,
  name,
  version,
  loading,
  description,
  env,
  notifications,
  snackbarOptions
});

const AppLayout = ({ classes }) => {
  const [drawerOpen, toggleDrawer] = useState(false);
  const {
    activePage,
    snackbarOptions,
    mode,
    directory,
    notifications,
    packages,
    packagesOutdated,
    env,
    ...restProps
  } = useMappedState(mapState);
  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.on('action-close', (event, error, message, options) => {
      const removedOrUpdatedPackages = options && options.slice(2);
      const operation = options && options[0];

      if (error && error.length) {
        dispatch(addActionError({ error }));
      }

      if (operation === 'uninstall' && removedOrUpdatedPackages) {
        dispatch(removePackages({ removedPackages: removedOrUpdatedPackages }));
      }

      const messageParts =
        message.indexOf('+') > -1 ? message.split('+') : message;
      const [info, msg] = messageParts;

      dispatch(
        setSnackbar({
          open: true,
          message: (msg && msg.trim()) || INFO_MESSAGES.updated
        })
      );

      dispatch(
        toggleLoader({
          loading: false,
          message: null
        })
      );
    });

    return () => ipcRenderer.removeAllListeners(['action-close']);
  });

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <nav className={classes.drawer}>
          <Navigator
            totalpackages={packages && packages.length}
            totaloutdated={packagesOutdated && packagesOutdated.length}
            totalnotifications={notifications && notifications.length}
            mode={mode}
            directory={directory && shrinkDirectory(directory)}
            title="Packages"
            PaperProps={{ style: { width: drawerWidth } }}
            userAgent={env && env.userAgent}
            {...restProps}
          />
        </nav>
        <div className={classes.appContent}>
          <Header onDrawerToggle={() => toggleDrawer(!drawerOpen)} />
          <main className={classes.mainContent}>
            {switchcase({
              packages: () => <Packages />,
              problems: () => <Notifications />
            })(<Packages />)(activePage)}
          </main>
        </div>
        {snackbarOptions && snackbarOptions.open && (
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            open={Boolean(snackbarOptions.open)}
            autoHideDuration={999000}
            onClose={() =>
              dispatch(
                setSnackbar({
                  open: false,
                  message: null
                })
              )
            }
          >
            <SnackbarContent
              variant={snackbarOptions.type}
              message={snackbarOptions.message}
              onClose={() =>
                dispatch(
                  setSnackbar({
                    open: false,
                    message: null
                  })
                )
              }
            />
          </Snackbar>
        )}
      </div>
    </MuiThemeProvider>
  );
};

AppLayout.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired
};

export default withStyles(styles)(AppLayout);
