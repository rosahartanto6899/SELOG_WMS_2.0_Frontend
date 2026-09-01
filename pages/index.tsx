/* eslint-disable @typescript-eslint/no-explicit-any */
import Dashboard from "@sera-components/pages/dashboard";
import UserApi from "@sera-libraries/api/auth";
import { RootState } from "@sera-redux";
import { loadingActions } from "@sera-redux/slices/loading.slice";
import _ from "lodash";
import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { connect } from "react-redux";

const DashboardPage: NextPage<any> = () => <Dashboard />;

const mapStateToProps = (state: RootState) => ({
  loading: state.loading,
});

const mapDispatchToProps = {
  clearLoading: loadingActions.clearLoading,
};

const determineRedirectURL = (dataAccessMenus: any) => {
  let redirectURL = null;
  const sortedAccessMenus = _.orderBy(dataAccessMenus, ["updatedAt"], ["desc"]);
  if (sortedAccessMenus.length > 0) {
    const firstAccessMenu = sortedAccessMenus[0];
    if (firstAccessMenu.menuLink !== "/") {
      if (firstAccessMenu.child && firstAccessMenu.child.length > 0) {
        const firstChildMenu = firstAccessMenu.child[0];
        if (firstChildMenu.child && firstChildMenu.child.length > 0) {
          const secondChildMenu = firstChildMenu.child[0];
          redirectURL = secondChildMenu.menuLink;
        } else {
          redirectURL = firstChildMenu.menuLink;
        }
      } else {
        redirectURL = firstAccessMenu.menuLink;
      }
    }
  }
  return redirectURL;
};

export async function getServerSideProps(ctx: any) {
  const session: any = await getSession(ctx);

  if (session?.detail?.data?.accessToken) {
    const accessMenus = await UserApi().retrieveMenuAccessByUser(
      session.detail.data.accessToken,
    );
    if (accessMenus?.status === 200) {
      const dataAccessMenus = accessMenus?.data?.data;
      const redirectURL =
        dataAccessMenus.length > 0
          ? determineRedirectURL(dataAccessMenus.length)
          : "/welcome";
      if (redirectURL) {
        return {
          redirect: {
            permanent: false,
            destination: redirectURL,
          },
          props: {},
        };
      }
    }
  }

  return {
    props: {},
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
