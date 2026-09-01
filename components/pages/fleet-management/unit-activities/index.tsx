import Form from "./unit-activities-form";
import InitialPage from "./unit-activities-initial-page";

interface UnitActivitiesProps {
  children: React.ReactNode;
}

const UnitActivities = ({ children }: UnitActivitiesProps) => ({
  children,
});

UnitActivities.InitialPage = InitialPage;
UnitActivities.Form = Form;

export default UnitActivities;
