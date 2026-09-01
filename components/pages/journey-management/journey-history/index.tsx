import DetailPage from "./journey-history-detail-page";
import InitialPage from "./journey-history-initial-page";

interface JourneyHistoryProps {
  children: React.ReactNode;
}

const JourneyHistory = ({ children }: JourneyHistoryProps) => ({
  children,
});

JourneyHistory.InitialPage = InitialPage;
JourneyHistory.DetailPage = DetailPage;

export default JourneyHistory;
