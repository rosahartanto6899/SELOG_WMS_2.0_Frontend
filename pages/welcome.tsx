import { useSession } from "next-auth/react";
import React from "react";

import PageLayout from "../components/layout/page-layout";

const Welcome = () => {
  const { data } = useSession() as any;

  return <PageLayout title={`Welcome, ${data?.user.name}`} content={null} />;
};

export default Welcome;
