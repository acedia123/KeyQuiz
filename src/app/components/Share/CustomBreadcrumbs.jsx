import React, { Fragment } from 'react';
import { NavigateNext, HomeRounded } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { routes } from '../../configs';
function CustomBreadcrumbs({ routeSegments, role }) {
    return (
        <div className="d-flex-align-center position-relative">
            {routeSegments ? (
                <Fragment>
                    <h4 className="m-0 fs-22 text-capitalize align-middle font-weight-bold">
                        {routeSegments[routeSegments.length - 1]['name']}
                    </h4>
                    <h4 className="m-0 ml-8 text-hint">|</h4>
                </Fragment>
            ) : null}
            <NavLink to={role === 'admin' ? routes.admin.dashboard : routes.home} className="normal-font d-flex-center">
                <HomeRounded className="align-middle ml-8 mb-1 color-primary" fontSize="large" />
            </NavLink>
            {routeSegments
                ? routeSegments.map((route, index) => (
                      <Fragment key={index}>
                          <NavigateNext className="text-hint" fontSize="medium" />
                          {route.path ? (
                              <NavLink to={route.path} className="link--hover">
                                  <span className="text-capitalize normal-font">{route.name}</span>
                              </NavLink>
                          ) : (
                              <span className="text-capitalize text-muted normal-font">{route.name}</span>
                          )}
                      </Fragment>
                  ))
                : null}
        </div>
    );
}

export default CustomBreadcrumbs;
