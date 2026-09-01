import JourneySupportForm from "./journey-support/journey-support-form";
import JourneySupportInitialPage from "./journey-support/journey-support-initial-page";
import TracingTrackingDetailPage from "./tracing-and-tracking/detail-page";
import TracingTrackingInitialPage from "./tracing-and-tracking/initial-page";
interface JourneyProps {
  children: React.ReactNode;
}

const JourneyMaganegement = ({ children }: JourneyProps) => ({ children });

JourneyMaganegement.TracingTrackingInitialPage = TracingTrackingInitialPage;
JourneyMaganegement.TracingTrackingDetailPage = TracingTrackingDetailPage;
JourneyMaganegement.JourneySupportInitialPage = JourneySupportInitialPage;
JourneyMaganegement.JourneySupportForm = JourneySupportForm;

export default JourneyMaganegement;
