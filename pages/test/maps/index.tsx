import dynamic from "next/dynamic";

const Maps = dynamic(() => import("@sera-components/leaflet_maps/maps"), {
  loading: () => <p>A map is loading...</p>,
  ssr: false,
});

const RoutingMap = dynamic(
  () => import("@sera-components/leaflet_maps/routing_maps"),
  {
    loading: () => <p>A map is loading...</p>,
    ssr: false,
  },
);

const MapsTestPage = () => (
  <div>
    <h1>MapsTestPage</h1>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "40px",
        marginTop: "40px",
      }}
    >
      <div>
        <h3>Klik pin untuk lihat lokasi</h3>
        <Maps />
      </div>

      <RoutingMap />
    </div>
  </div>
);

export default MapsTestPage;
