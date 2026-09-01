import Card from "../card";

interface FormActionsProps {
  children: React.ReactNode;
  show?: boolean;
}

const defaultProps = {
  show: true,
};

const FormActions = ({
  children,
  show = true,
}: FormActionsProps): JSX.Element | null => {
  if (!show) return null;
  return <Card.FormActions>{children}</Card.FormActions>;
};

FormActions.defaultProps = defaultProps;

export default FormActions;
