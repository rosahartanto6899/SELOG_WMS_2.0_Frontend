import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: any) {
  const session: any = await getSession(ctx);

  return {
    redirect: {
      permanent: false,
      destination: session?.detail?.data?.accessToken ? "/welcome" : "/auth",
    },
    props: {},
  };
}

export default function HomePage() {
  return null;
}
